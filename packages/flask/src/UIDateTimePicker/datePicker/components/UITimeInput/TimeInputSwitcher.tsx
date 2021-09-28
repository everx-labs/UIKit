import React from 'react';
import { View } from 'react-native';
import {
    TouchableOpacity,
    ColorVariants,
    makeStyles,
    Theme,
    UILabel,
    useTheme,
    TypographyVariants,
} from '@tonlabs/uikit.hydrogen';

// todo DateTimePickerHeader
export function TimeInputSwitcher({
    onPress,
    isAM = true,
}: {
    onPress: () => void;
    isAM: boolean;
}) {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.container}>
            <View style={[styles.labelContainer, isAM && styles.button]}>
                <UILabel role={TypographyVariants.Action}>AM</UILabel>
            </View>
            <View style={[styles.labelContainer, !isAM && styles.button]}>
                <UILabel role={TypographyVariants.Action}>PM</UILabel>
            </View>
        </TouchableOpacity>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        backgroundColor: theme[ColorVariants.BackgroundTertiary] as string,
        width: 89,
        height: 32,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        marginLeft: 12,
    },
    labelContainer: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 6,
        width: 42,
        height: 28,
        elevation: 1,
        shadowColor: theme[ColorVariants.BackgroundOverlay] as string,
        shadowRadius: 0.5,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    button: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary] as string,
    },
}));
