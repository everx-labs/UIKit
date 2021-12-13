import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import type { ContentAnimations } from './types';

export function useContentAnimatedStyles(
    contentColor: ColorVariants,
    hoverOpacityAnimValue: Animated.SharedValue<number>,
    pressOpacityAnimValue: Animated.SharedValue<number>,
    hoverColor: ColorVariants,
    pressColor: ColorVariants,
): ContentAnimations {
    const theme = useTheme();

    const hoverIconAnimStyle = useAnimatedStyle(() => {
        return {
            tintColor: theme[ColorVariants[hoverColor]] as string,
            opacity: hoverOpacityAnimValue.value,
        };
    });

    const pressIconAnimStyle = useAnimatedStyle(() => {
        return {
            tintColor: theme[ColorVariants[pressColor]] as string,
            opacity: pressOpacityAnimValue.value,
        };
    });

    const titleStyle = useAnimatedStyle(() => {
        if (pressOpacityAnimValue.value > 0.5) {
            return {
                color: theme[ColorVariants[pressColor]] as string,
            };
        }
        if (hoverOpacityAnimValue.value > 0.5) {
            return {
                color: theme[ColorVariants[hoverColor]] as string,
            };
        }
        return {
            color: theme[ColorVariants[contentColor]] as string,
        };
    });

    return {
        // title: {
        //     hoverStyle: hoverTitleAnimStyle,
        //     pressStyle: pressTitleAnimStyle,
        // },
        titleStyle,
        icon: {
            hoverStyle: hoverIconAnimStyle,
            pressStyle: pressIconAnimStyle,
        },
    };
}
