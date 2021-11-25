import React from 'react';
import Fuse from 'fuse.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, useWindowDimensions, Platform, Keyboard } from 'react-native';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

import { UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/localization';
import { UISearchBar } from '@tonlabs/uicast.bars';
import { UIBottomSheet } from '@tonlabs/uikit.popups';
import { FlatList } from '@tonlabs/uikit.scrolls';
import { UILinkButton } from '@tonlabs/uikit.controls';
import {
    TypographyVariants,
    UILabel,
    ColorVariants,
    useTheme,
    Theme,
    makeStyles,
} from '@tonlabs/uikit.themes';
import type { CountriesArray, Country, WrappedCountryPickerProps } from './types';
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

function returnCountryRow({ item }: { item: Country }) {
    return <CountryPickerRow item={item} />;
}

export function CountryPicker({
    onClose,
    onSelect,
    visible,
    banned = [],
    permitted = [],
}: WrappedCountryPickerProps) {
    const { height } = useWindowDimensions();

    const theme = useTheme();
    const styles = useStyles(theme, height);

    const [loading, setLoading] = React.useState(true);

    const [search, setSearch] = React.useState('');
    const [countriesList, setCountriesList] = React.useState<CountriesArray>([]);
    const [filteredList, setFilteredList] = React.useState(countriesList);
    const fuse = React.useMemo(() => new Fuse(filteredList, fuseOptions), [filteredList]);

    const insets = useSafeAreaInsets();
    const contentInset = React.useMemo(
        () => ({
            top: 0, // without it adds some additional space on iOS
            bottom: insets.bottom + UIConstant.contentOffset() + UIConstant.buttonHeight(),
        }),
        [insets?.bottom],
    );

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
        list => {
            const permittedCountries = list.filter((country: any) => checkIncludes(country.code));
            setCountriesList(permittedCountries);
        },
        [checkIncludes],
    );

    React.useEffect(() => {
        setFilteredList(countriesList);
    }, [countriesList]);

    React.useEffect(() => {
        const result = search ? fuse.search(search) : countriesList;
        setFilteredList(result as CountriesArray);
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

        () => {
            isAndroid && AndroidKeyboardAdjust.setAdjustPan();
            console.warn('!!!');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (isAndroid) {
            // We should use react-native-android-keyboard-adjust
            // to fix android keyboard work with UIBottomSheet
            // also we have to check if component visible
            // and only if it showing call setAdjustNothing
            // because in other cases we may need the default adjust - setAdjustPan
            visible
                ? AndroidKeyboardAdjust.setAdjustNothing()
                : AndroidKeyboardAdjust.setAdjustPan();
        }
    }, [visible]);

    const hideKeyboard = React.useCallback(() => {
        // react-native-android-keyboard-adjust bug:
        // Keyboard doesn't want to hide on Android
        // so we have to forcibly hide the keyboard
        isAndroid && Keyboard.dismiss();
    }, []);

    const renderSearchHeader = () => {
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
                <UISearchBar returnKeyType="done" value={search} onChangeText={setSearch} />
            </View>
        );
    };

    const keyExtractor = React.useCallback((item: Country) => item.code, []);

    return (
        <UIBottomSheet
            onClose={onClose}
            visible={visible}
            style={styles.sheet}
            shouldHandleKeyboard={false}
        >
            {renderSearchHeader()}
            <CountryPickerContext.Provider value={{ loading, onSelect }}>
                <FlatList
                    data={filteredList}
                    renderItem={returnCountryRow}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={ListEmptyComponent}
                    keyboardDismissMode="interactive"
                    contentInset={contentInset}
                    onMomentumScrollBegin={hideKeyboard}
                />
            </CountryPickerContext.Provider>
        </UIBottomSheet>
    );
}

const useStyles = makeStyles((theme: Theme, height: number) => ({
    sheet: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary] as string,
        borderRadius: 10,
        height,
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
