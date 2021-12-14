import * as React from 'react';
import type { ColorValue } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import {
    ContentAnimations,
    ActionButtonColorScheme,
    UIActionButtonType,
    ActionButtonAnimations,
    ActionButtonColors,
} from './types';
import { runUIGetTransparentColor } from './runUIGetTransparentColor';
import { UIConstant } from '../constants';

export const useButtonColorScheme = (type: UIActionButtonType): ActionButtonColorScheme => {
    return React.useMemo((): ActionButtonColorScheme => {
        switch (type) {
            case UIActionButtonType.Primary:
                return {
                    overlay: {
                        normal: ColorVariants.BackgroundBW,
                        hover: ColorVariants.BackgroundBW,
                        pressed: ColorVariants.BackgroundBW,
                        disabled: ColorVariants.BackgroundBW,
                    },
                    content: {
                        normal: ColorVariants.TextAccent,
                        hover: ColorVariants.SpecialAccentLight,
                        pressed: ColorVariants.SpecialAccentDark,
                        disabled: ColorVariants.TextTertiary,
                    },
                };
            case UIActionButtonType.Accent:
            default:
                return {
                    overlay: {
                        normal: ColorVariants.BackgroundAccent,
                        hover: ColorVariants.SpecialAccentLight,
                        pressed: ColorVariants.SpecialAccentDark,
                        disabled: ColorVariants.BackgroundNeutral,
                    },
                    content: {
                        normal: ColorVariants.TextPrimary,
                        hover: ColorVariants.TextPrimary,
                        pressed: ColorVariants.TextPrimary,
                        disabled: ColorVariants.TextTertiary,
                    },
                };
        }
    }, [type]);
};

export function useContentAnimatedStyles(
    hoverAnimValue: Animated.SharedValue<number>,
    pressAnimValue: Animated.SharedValue<number>,
    hoverOverlayColor: ColorVariants,
    pressOverlayColor: ColorVariants,
    contentColor: ColorVariants,
): ContentAnimations {
    const theme = useTheme();

    const hoverIconAnimStyle = useAnimatedStyle(() => {
        return {
            tintColor: theme[ColorVariants[hoverOverlayColor]] as string,
            opacity: hoverAnimValue.value,
        };
    });

    const pressIconAnimStyle = useAnimatedStyle(() => {
        return {
            tintColor: theme[ColorVariants[pressOverlayColor]] as string,
            opacity: pressAnimValue.value,
        };
    });

    const titleColorAnimValue = useDerivedValue(() => {
        console.log({
            hover: hoverAnimValue.value,
            press: pressAnimValue.value,
        });
        return interpolateColor(
            -hoverAnimValue.value + pressAnimValue.value * 1000,
            [-1, 0, 1000],
            [
                theme[ColorVariants[hoverOverlayColor]] as string,
                theme[ColorVariants[contentColor]] as string,
                theme[ColorVariants[pressOverlayColor]] as string,
            ],
        );
    });

    const titleStyle = useAnimatedStyle(() => {
        return {
            color: titleColorAnimValue.value,
        };
    });

    return {
        titleStyle,
        icon: {
            hoverStyle: hoverIconAnimStyle,
            pressStyle: pressIconAnimStyle,
        },
    };
}

export function useButtonAnimations(
    hoverOverlayColor: ColorVariants,
    pressOverlayColor: ColorVariants,
): ActionButtonAnimations {
    const theme = useTheme();

    const hoverAnim = useSharedValue(0);
    const hoverOverlayValue = useDerivedValue(() => {
        return interpolateColor(
            hoverAnim.value,
            [0, 1],
            [
                runUIGetTransparentColor(theme[ColorVariants[hoverOverlayColor]] as string),
                theme[ColorVariants[hoverOverlayColor]] as string,
            ],
        );
    });
    const hoverOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: hoverOverlayValue.value,
        };
    });

    const pressAnim = useSharedValue(0);
    const pressOverlayValue = useDerivedValue(() => {
        return interpolateColor(
            pressAnim.value,
            [0, 1],
            [
                runUIGetTransparentColor(theme[ColorVariants[pressOverlayColor]] as string),
                theme[ColorVariants[pressOverlayColor]] as string,
            ],
        );
    });
    const pressOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: pressOverlayValue.value,
        };
    });

    return {
        hover: {
            animationParam: hoverAnim,
            backgroundStyle: undefined,
            overlayStyle: hoverOverlayStyle,
        },
        press: {
            animationParam: pressAnim,
            backgroundStyle: undefined,
            overlayStyle: pressOverlayStyle,
        },
    };
}

export function useButtonStyles(
    disabled: boolean | undefined,
    overlay: ActionButtonColors,
    content: ActionButtonColors,
) {
    let backgroundColor: ColorVariants = overlay.normal;
    let contentColor: ColorVariants = content.normal;

    if (disabled) {
        backgroundColor = overlay.disabled;
    }

    if (disabled) {
        contentColor = content.disabled;
    }

    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
        borderRadius: UIConstant.alertBorderRadius,
    };

    return {
        buttonStyle,
        contentColor,
    };
}
