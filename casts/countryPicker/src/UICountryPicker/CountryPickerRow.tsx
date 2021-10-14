import React from 'react';
import { View } from 'react-native';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILabel, ColorVariants, useTheme, Theme, makeStyles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';

import type { Country } from './types';
import { CountryPickerContext } from './CountryPickerContext';

type CountryRowProps = {
    item: Country;
};

export const CountryPickerRow: React.FC<CountryRowProps> = ({ item }: CountryRowProps) => {
    const { onSelect } = React.useContext(CountryPickerContext);

    const theme = useTheme();
    const styles = useStyles(theme);

    const imageStyle = {
        marginRight: UILayoutConstant.contentOffset,
        width: 32,
        height: 24,
        borderRadius: 4,
    };

    const onPress = React.useCallback(() => {
        onSelect && onSelect(item.code);
    }, [item.code, onSelect]);

    return (
        <TouchableOpacity onPress={onPress} style={styles.rowContainer}>
            <View style={styles.rowContainerInner}>
                <UIImage
                    style={imageStyle}
                    source={{ uri: `data:image/png;base64,${item.flag}` }}
                />
                <UILabel>{item.name}</UILabel>
            </View>
        </TouchableOpacity>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    rowContainerInner: {
        paddingVertical: UILayoutConstant.contentOffset,
        flexDirection: 'row',
        borderBottomColor: theme[ColorVariants.LineTertiary] as string,
        borderBottomWidth: 1,
    },
    rowContainer: {
        paddingLeft: UILayoutConstant.contentOffset,
    },
}));
