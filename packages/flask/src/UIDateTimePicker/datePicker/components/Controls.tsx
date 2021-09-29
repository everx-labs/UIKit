import React from 'react';
import { View } from 'react-native';
import {
    ColorVariants,
    makeStyles,
    Theme,
    TouchableOpacity,
    TypographyVariants,
    UILabel,
    useTheme,
} from '@tonlabs/uikit.hydrogen';

export type DateControlsProps = {
    onPressMonth?: () => void;
    onPressYear?: () => void;
    month?: string;
    year?: string;
};

export function Separator() {
    const theme = useTheme();
    const styles = useStyles(theme);
    return <View style={styles.separator} />;
}

export function MonthYearButton({ onPressMonth, onPressYear, month, year }: DateControlsProps) {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.monthYearContainer}>
            {!!month && (
                <TouchableOpacity onPress={onPressMonth}>
                    <UILabel role={TypographyVariants.Action}>{month}</UILabel>
                </TouchableOpacity>
            )}
            {!!month || !!year && <Separator />}
            {!!year && (
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
    const styles = useStyles(theme);

    return (
        <View>
            <View>
                <View style={styles.monthYearContainer}>
                    <TouchableOpacity onPress={onPressLeft}>
                        <UILabel role={TypographyVariants.Action}>{'<'}</UILabel>
                    </TouchableOpacity>
                    <Separator />
                    <TouchableOpacity onPress={onPressRight}>
                        <UILabel role={TypographyVariants.Action}>{'>'}</UILabel>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    monthYearContainer: {
        backgroundColor: theme[ColorVariants.BackgroundTertiary] as string,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    separator: {
        height: 12,
        width: 1,
        backgroundColor: theme[ColorVariants.BackgroundTertiaryInverted],
        marginHorizontal: 12,
    },
}));
