import React from 'react';
import { View } from 'react-native';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILabel, ColorVariants, useTheme, Theme, makeStyles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import type { Country } from './types';
import { CountryPickerContext } from './CountryPickerContext';

type CountryRowProps = {
    item: Country;
};

export const CountryPickerRow: React.FC<CountryRowProps> = ({ item }: CountryRowProps) => {
    const { onSelect } = React.useContext(CountryPickerContext);

    const theme = useTheme();
    const styles = useStyles(theme);

    const onPress = React.useCallback(() => {
        onSelect && onSelect(item.code);
    }, [item]);

    return (
        <TouchableOpacity onPress={onPress} style={styles.rowContainer}>
            <View style={styles.rowContainerInner}>
                <UILabel>{item.name}</UILabel>
                <UILabel style={styles.emojiContainer}>{item.emoji}</UILabel>
            </View>
        </TouchableOpacity>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    rowContainerInner: {
        paddingVertical: UILayoutConstant.contentOffset,
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
}));
