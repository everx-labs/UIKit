import React from 'react';
import Fuse from 'fuse.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Platform, Keyboard } from 'react-native';
import { useKeyboard } from '@react-native-community/hooks';

import { uiLocalized } from '@tonlabs/localization';
import { UISearchBar } from '@tonlabs/uicast.bars';
import { UIModalSheet } from '@tonlabs/uikit.popups';
import { FlatList } from '@tonlabs/uikit.scrolls';
import { UILinkButton } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import {
    TypographyVariants,
    UILabel,
    ColorVariants,
    useTheme,
    Theme,
    makeStyles,
} from '@tonlabs/uikit.themes';
import type {
    CountriesArray,
    Country,
    WrappedCountryPickerProps,
    CountryPickerProps,
} from './types';
import { CountryPickerRow } from './CountryPickerRow';
import { ListEmptyComponent } from './ListEmptyComponent';
import { CountryPickerContext } from './CountryPickerContext';

const COUNTRIES_URL = 'https://ton-uikit-example-7e797.web.app/countries.json';

const fetchJSON = async () => {
    const results = await fetch(COUNTRIES_URL);
    return results.json();
};

const fuseOptions = {
    ignoreLocation: true,
    threshold: 0.4,
    findAllMatches: true,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name'],
};

const isAndroid = Platform.OS === 'android';

function renderCountryRow({ item }: { item: Country }) {
    return <CountryPickerRow item={item} />;
}

const keyExtractor = (item: Country) => item.code;

function SearchHeader({
    searching,
    onSearch,
    onClose,
}: {
    searching: boolean;
    onSearch: (text: string) => void;
    onClose: () => void;
}) {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerTitleContainer}>
                <View style={styles.sideHeaderView}>
                    <UILinkButton onPress={onClose} title={uiLocalized.Cancel} />
                </View>
                <UILabel role={TypographyVariants.HeadlineHead} style={styles.headerTitle}>
                    {uiLocalized.CountryPicker.Title}
                </UILabel>
                <View style={styles.sideHeaderView} />
            </View>
            <UISearchBar searching={searching} returnKeyType="done" onChangeText={onSearch} />
        </View>
    );
}

function useCountriesSearch(
    banned: WrappedCountryPickerProps['banned'] = [],
    permitted: WrappedCountryPickerProps['permitted'] = [],
) {
    const [loading, setLoading] = React.useState(true);

    const [search, setSearch] = React.useState('');
    const [searching, setSearching] = React.useState(false);
    const [countriesList, setCountriesList] = React.useState<CountriesArray>([]);
    const [filteredList, setFilteredList] = React.useState(countriesList);
    const fuse = React.useMemo(() => new Fuse(countriesList, fuseOptions), [countriesList]);

    const checkIncludes = React.useCallback(
        (code: string) => {
            let isPermitted = true;
            let isBanned = false;
            if (permitted.length) {
                isPermitted = permitted.includes(code);
            }
            if (banned.length) {
                isBanned = banned.includes(code);
            }
            return isPermitted && !isBanned;
        },
        [banned, permitted],
    );

    const filterCountries = React.useCallback(
        (list: CountriesArray) => {
            const permittedCountries = list.filter((country: any) => checkIncludes(country.code));
            setCountriesList(permittedCountries);
        },
        [checkIncludes],
    );

    React.useEffect(() => {
        setFilteredList(countriesList);
    }, [countriesList]);

    React.useEffect(() => {
        if (search.length === 0) {
            setFilteredList(countriesList);
            return;
        }
        setSearching(true);

        requestAnimationFrame(() => {
            const result = fuse.search(search);
            setSearching(false);
            setFilteredList(result as CountriesArray);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    React.useEffect(() => {
        fetchJSON()
            .then((r: CountriesArray) => {
                if (permitted.length || banned.length) {
                    filterCountries(r);
                } else {
                    setCountriesList(r);
                }
            })
            .catch((e: Error) => {
                console.error(e);
            })
            .finally(() => {
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        loading,
        searching,
        onSearch: setSearch,
        countries: filteredList,
    };
}

function CountryPickerContent({ banned, permitted, onClose, onSelect }: CountryPickerProps) {
    const insets = useSafeAreaInsets();
    const { keyboardShown, keyboardHeight } = useKeyboard();

    const contentContainerStyle = React.useMemo(
        () => ({
            paddingBottom: keyboardShown ? keyboardHeight : insets.bottom,
        }),
        [insets?.bottom, keyboardShown, keyboardHeight],
    );
    const scrollIndicatorInsets = React.useMemo(
        () => ({
            top: 0,
            bottom: keyboardShown ? keyboardHeight : insets.bottom,
        }),
        [insets?.bottom, keyboardShown, keyboardHeight],
    );

    const hideKeyboard = React.useCallback(() => {
        // Keyboard doesn't want to hide on Android
        // so we have to forcibly hide the keyboard
        isAndroid && Keyboard.dismiss();
    }, []);

    const { loading, searching, countries, onSearch } = useCountriesSearch(banned, permitted);

    return (
        <>
            <SearchHeader searching={searching} onClose={onClose} onSearch={onSearch} />
            <CountryPickerContext.Provider value={{ loading, onSelect }}>
                <FlatList
                    data={countries}
                    renderItem={renderCountryRow}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={ListEmptyComponent}
                    keyboardDismissMode="interactive"
                    onMomentumScrollBegin={hideKeyboard}
                    contentContainerStyle={contentContainerStyle}
                    scrollIndicatorInsets={scrollIndicatorInsets}
                    automaticallyAdjustContentInsets
                    automaticallyAdjustKeyboardInsets
                />
            </CountryPickerContext.Provider>
        </>
    );
}

export function CountryPicker({ visible, ...countryPickerProps }: WrappedCountryPickerProps) {
    const theme = useTheme();
    const styles = useStyles(theme);

    const { onClose } = countryPickerProps;

    return (
        <UIModalSheet
            onClose={onClose}
            visible={visible}
            style={styles.sheet}
            maxMobileWidth={UILayoutConstant.elasticWidthNormal}
        >
            <CountryPickerContent {...countryPickerProps} />
        </UIModalSheet>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    sheet: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary] as string,
        borderRadius: 10,
    },
    headerContainer: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary] as string,
        borderBottomColor: theme[ColorVariants.LineTertiary] as string,
        borderBottomWidth: 1,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingBottom: 12,
        height: 120,
    },
    headerTitleContainer: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        flex: 1,
    },
    sideHeaderView: {
        flex: 1,
    },
    headerTitle: {
        flex: 2,
        alignSelf: 'center',
        textAlign: 'center',
    },
}));
