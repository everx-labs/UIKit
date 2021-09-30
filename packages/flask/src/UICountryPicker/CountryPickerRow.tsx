import React from 'react';
import { View } from 'react-native';

import {
    ColorVariants,
    makeStyles,
    Theme,
    TouchableOpacity,
    UILabel,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.navigation';

import type { Country } from '../types';
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
                <UILabel style={styles.emojiContainer}>{item.emoji}</UILabel>
                <UILabel>{item.name}</UILabel>
            </View>
        </TouchableOpacity>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    rowContainerInner: {
        paddingVertical: UIConstant.contentOffset,
        flexDirection: 'row',
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
