import React from 'react';
import Fuse from 'fuse.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    FlatList,
    UIBottomSheet,
    UISearchBar,
    UIConstant as NavigationConstants,
} from '@tonlabs/uikit.navigation';
import {
    ColorVariants,
    makeStyles,
    Theme,
    TouchableOpacity,
    TypographyVariants,
    UILabel,
    UILinkButton,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import type { CountriesArray, Country, WrappedCountryPickerProps } from '../types';

const COUNTRIES_URL = 'https://uikit.tonlabs.io/countries.json';

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

export function CountryPicker({
    onClose,
    onSelect,
    visible,
    banned = [],
    permitted = [],
}: WrappedCountryPickerProps) {
    const height = useWindowDimensions().height;

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

    const onSelectCountry = React.useCallback(
        (item: Country) => {
            onSelect && onSelect(item.code);
        },
        [onSelect],
    );

    const checkIncludes = React.useCallback((code: string) => {
        let isPermitted = true;
        let isBanned = false;
        if (permitted.length) {
            isPermitted = permitted.includes(code);
        }
        if (banned.length) {
            isBanned = banned.includes(code);
        }
        return isPermitted && !isBanned;
    }, []);

    const filterCountries = React.useCallback(
        list => {
            const permittedCountries = list.filter((country: any) => checkIncludes(country.code));
            setFilteredList(permittedCountries);
        },
        [banned, permitted],
    );

    React.useEffect(() => {
        setFilteredList(countriesList);
    }, [countriesList]);

    React.useEffect(() => {
        const result = search ? fuse.search(search) : countriesList;
        setFilteredList(result as CountriesArray);
    }, [search]);

    React.useEffect(() => {
        fetchJSON()
            .then((r: CountriesArray) => {
                console.log(r);
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

    const renderCountryRow = ({ item }: { item: Country }) => {
        const onPress = () => onSelectCountry(item);
        return (
            <TouchableOpacity onPress={onPress} style={styles.rowContainer}>
                <View style={styles.rowContainerInner}>
                    <UILabel>{item.name}</UILabel>
                    <UILabel style={styles.emojiContainer}>{item.emoji}</UILabel>
                </View>
            </TouchableOpacity>
        );
    };

    const renderLoading = () => {
        return <ActivityIndicator />;
    };

    const renderEmptyList = () => {
        return (
            <>
                <UILabel role={TypographyVariants.TitleMedium} color={ColorVariants.TextSecondary}>
                    {uiLocalized.CountryPicker.CountryNotFindTitle}
                </UILabel>
                <UILabel role={TypographyVariants.Action} color={ColorVariants.TextSecondary}>
                    {uiLocalized.CountryPicker.CountryNotFindDetails}
                </UILabel>
            </>
        );
    };

    const ListEmptyComponent = React.useMemo(() => {
        return (
            <View style={styles.emptyContainer}>
                {loading ? renderLoading() : renderEmptyList()}
            </View>
        );
    }, [loading]);

    const keyExtractor = React.useCallback((item: Country) => item.code, []);

    return (
        <UIBottomSheet onClose={onClose} visible={visible} style={styles.sheet}>
            {renderSearchHeader()}
            <FlatList
                data={filteredList}
                renderItem={renderCountryRow}
                keyExtractor={keyExtractor}
                ListEmptyComponent={ListEmptyComponent}
                keyboardDismissMode="on-drag"
                contentInset={contentInset}
            />
        </UIBottomSheet>
    );
}

const useStyles = makeStyles((theme: Theme, height) => ({
    sheet: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary] as string,
        borderRadius: 10,
        height: height,
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
    rowContainerInner: {
        paddingVertical: NavigationConstants.contentOffset,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: theme[ColorVariants.LineTertiary] as string,
        borderBottomWidth: 1,
    },
    rowContainer: {
        paddingLeft: 16,
    },
    emojiContainer: {
        paddingRight: 16,
    },
    emptyContainer: {
        paddingTop: 48,
        alignItems: 'center',
    },
}));
