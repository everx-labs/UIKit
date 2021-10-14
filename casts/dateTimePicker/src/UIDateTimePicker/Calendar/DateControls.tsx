import React from 'react';
import { View } from 'react-native';
import {
    ColorVariants,
    makeStyles,
    Theme,
    TypographyVariants,
    UILabel,
    useTheme,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIImage } from '@tonlabs/uikit.media';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant } from '../../constants';

export type DateControlsProps = {
    onPressMonth?: () => void;
    onPressYear?: () => void;
    month?: string;
    year?: string;
};

export function MonthYearButton({ onPressMonth, onPressYear, month, year }: DateControlsProps) {
    const theme = useTheme();
    const styles = useStyles(theme);

    if (month == null && year == null) {
        return null;
    }

    return (
        <View style={styles.container}>
            {month != null && (
                <TouchableOpacity onPress={onPressMonth}>
                    <UILabel role={TypographyVariants.Action}>{month}</UILabel>
                </TouchableOpacity>
            )}
            {month != null && <View style={styles.separator} />}
            {year != null && (
                <TouchableOpacity onPress={onPressYear}>
                    <UILabel role={TypographyVariants.Action}>{year}</UILabel>
                </TouchableOpacity>
            )}
        </View>
    );
}

export type ArrowsButtonsProps = {
    onPressLeft: () => void;
    onPressRight: () => void;
};

export function ArrowsButtons({ onPressLeft, onPressRight }: ArrowsButtonsProps) {
    const theme = useTheme();
    const styles: any = useStyles(theme);

    return (
        <View style={[styles.arrows, styles.container]}>
            <TouchableOpacity onPress={onPressLeft}>
                <UIImage style={styles.icon} source={UIAssets.icons.ui.chevron} />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={onPressRight}>
                <UIImage
                    style={[styles.icon, styles.rotateIcon]}
                    source={UIAssets.icons.ui.chevron}
                />
            </TouchableOpacity>
        </View>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        backgroundColor: theme[ColorVariants.BackgroundTertiary] as string,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: UILayoutConstant.smallContentOffset,
        paddingVertical: UILayoutConstant.tinyContentOffset,
    },
    separator: {
        height: 12,
        width: 1,
        backgroundColor: theme[ColorVariants.BackgroundTertiaryInverted],
        marginHorizontal: UILayoutConstant.normalContentOffset,
    },
    arrows: {
        marginLeft: UILayoutConstant.normalContentOffset,
    },
    icon: {
        width: UIConstant.datePicker.iconSize,
        height: UIConstant.datePicker.iconSize,
    },
    rotateIcon: {
        transform: [{ rotate: '180deg' }],
    },
}));
