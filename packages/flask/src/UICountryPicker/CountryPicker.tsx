import React from 'react';
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
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIConstant, FlatList, UIBottomSheet  } from '@tonlabs/uikit.navigation';
import { View, Dimensions } from 'react-native';
import type { Country, CountryPickerProps } from './types';

import countriesListJSON from './countries.json';

export function CountryPicker({
    onSelect,
    onClose,
    visible,
    permitted = [],
    banned = [],
}: CountryPickerProps) {
    const theme = useTheme();
    const styles = useStyles(theme);

    const [countriesList, setCountriesList] = React.useState<Country[]>(countriesListJSON);

    const onSelectCountry = (item: Country) => {
        onClose();
        onSelect && onSelect(item.code);
    };

    const filterCountries = React.useCallback(() => {
        const check = (code: string) => permitted.includes(code) && !banned.includes(code);
        const permittedCountries = countriesListJSON.filter((country: any) => check(country.code));
        setCountriesList(permittedCountries);
    }, [banned, permitted]);

    React.useEffect(() => {
        if (permitted.length || banned.length) {
            filterCountries();
        }
    }, [permitted, banned, filterCountries]);

    const renderSearchHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.cancelContainer}>
                        <UILinkButton onPress={onClose} title={uiLocalized.Cancel} />
                    </View>
                    <UILabel role={TypographyVariants.HeadlineHead} style={styles.headerTitle}>
                        Choose a Country
                    </UILabel>
                </View>
                <UISearchBar />
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

    return (
        <UIBottomSheet
            onClose={onClose}
            visible={visible}
            style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                height: Dimensions.get('window').height,
            }}
        >
            <FlatList
                data={countriesList}
                ListHeaderComponent={renderSearchHeader}
                renderItem={renderCountryRow}
                keyExtractor={item => item.code}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ overflow: 'hidden' }}
            />
        </UIBottomSheet>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    headerContainer: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingBottom: 12,
    },
    headerTitleContainer: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        flex: 1,
    },
    cancelContainer: {
        flex: 1,
    },
    headerTitle: {
        flex: 2.5,
        alignSelf: 'center',
    },
    rowContainerInner: {
        paddingVertical: UIConstant.contentOffset,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    rowContainer: {
        paddingLeft: 16,
    },
    emojiContainer: {
        paddingRight: 16,
    },
}));
