import React from 'react';
import Fuse from 'fuse.js';
import { Dimensions, StatusBar, View } from 'react-native';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { FlatList, ScrollView, UIBottomSheet, UIConstant, UISearchBar } from '@tonlabs/uikit.navigation';
import {
    ColorVariants,
    makeStyles,
    Theme, TouchableOpacity,
    TypographyVariants,
    UILabel,
    UILinkButton,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import type { Country, WrappedCountryPickerProps } from './types';

// @ts-ignore TODO: replace with fetched json
import countriesListJSON from './countries.json';

const fuseOptions = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name'],
};

// TODO: add wrapper web version(modal) when gotovo
export function CountryPicker(
    {
        onClose,
        onSelect,
        visible,
        banned = [],
        permitted = [],
    }: WrappedCountryPickerProps) {

    const theme = useTheme();
    const styles = useStyles(theme);

    const [search, setSearch] = React.useState('');
    const [countriesList, setCountriesList] = React.useState<Country[]>(countriesListJSON);
    const [filteredList, setFilteredList] = React.useState(countriesList);
    const fuse = React.useMemo(() => new Fuse(countriesList, fuseOptions), [countriesList]);

    const onSelectCountry = React.useCallback((item: Country) => {
        onSelect && onSelect(item.code);
    }, [onSelect]);

    const filterCountries = React.useCallback(() => {
        const check = (code: string) => {
            let isPermitted = true;
            let isBanned = false;
            if (permitted.length) {
                isPermitted = permitted.includes(code);
            }
            if (banned.length) {
                isBanned = banned.includes(code);
            }
            return isPermitted && !isBanned;
        };
        const permittedCountries = countriesListJSON.filter((country: any) => check(country.code));
        setCountriesList(permittedCountries);
    }, [banned, permitted]);

    const renderSearchHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.sideHeaderView}>
                        <UILinkButton onPress={onClose} title={uiLocalized.Cancel} />
                    </View>
                    <UILabel
                        role={TypographyVariants.HeadlineHead}
                        style={styles.headerTitle}
                    >
                        {uiLocalized.CountryPicker.Title}
                    </UILabel>
                    <View style={styles.sideHeaderView} />
                </View>
                <UISearchBar returnKeyType='done' value={search} onChangeText={setSearch} />
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

    const ListEmptyComponent = () => {
        return (
            <View style={styles.emptyContainer}>
                <UILabel
                    role={TypographyVariants.TitleMedium}
                    color={ColorVariants.TextSecondary}
                >
                    {uiLocalized.CountryPicker.CountryNotFindTitle}
                </UILabel>
                <UILabel
                    role={TypographyVariants.Action}
                    color={ColorVariants.TextSecondary}
                >
                    {uiLocalized.CountryPicker.CountryNotFindDetails}
                </UILabel>
            </View>
        );
    };

    React.useEffect(() => {
        if (permitted.length || banned.length) {
            filterCountries();
        }
    }, []);

    React.useEffect(() => {
        const result = search ? fuse.search(search) : countriesList;
        setFilteredList(result as Country[]);
    }, [search]);

    const keyExtractor = React.useCallback((item: Country) => item.code, []);

    return (
        <UIBottomSheet
            onClose={onClose}
            visible={visible}
            style={styles.sheet}>
            <ScrollView
                stickyHeaderIndices={[0]}
            >
                {renderSearchHeader()}
                <FlatList
                    data={filteredList}
                    renderItem={renderCountryRow}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={ListEmptyComponent}
                    keyboardDismissMode='on-drag'
                />
            </ScrollView>
        </UIBottomSheet>
    );
}

const { height } = Dimensions.get('screen');

const useStyles = makeStyles((theme: Theme) => ({
    sheet: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary] as string,
        borderRadius: 10,
        height: height - (StatusBar.currentHeight ?? 0),
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
        paddingVertical: UIConstant.contentOffset,
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
    emptyContainer:
        {
            paddingTop: 48,
            alignItems: 'center',
        },
}));
