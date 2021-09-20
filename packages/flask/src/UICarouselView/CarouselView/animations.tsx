import React from 'react';
import Animated, {
    withSpring,
    useDerivedValue,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    interpolateColor,
} from 'react-native-reanimated';
import { Theme, UIBackgroundViewColors } from '@tonlabs/uikit.hydrogen';

import { PaginationState } from '../types';

/**
 * Base duration of timing animations in component
 */
export const duration = 400;

/**
 * Config of any spring animations in component
 */
const springConfig: Animated.WithSpringConfig = {
    damping: 100,
    stiffness: 500,
    mass: 3,
    overshootClamping: false,
};

/**
 * Hook for page animation (opacity and scale), mobile only
 */
export const usePageStyle = (initialOffset: any) => {
    const offset = useSharedValue(initialOffset);

    React.useEffect(() => {
        offset.value = initialOffset;
    }, [offset, initialOffset]);

    const animatedValue = useDerivedValue(() => {
        return withSpring(offset.value, springConfig);
    });

    const animatedStyles = useAnimatedStyle(() => {
        const opacity = interpolate(animatedValue.value, [1, 0], [0.5, 1]);
        const transform = [
            {
                scale: interpolate(animatedValue.value, [1, 0], [0.9, 1]),
            },
        ];
        return {
            opacity,
            transform,
        };
    });

    return animatedStyles;
};

/**
 * Pagination animations
 */
export const usePaginationStyle = (active: boolean, theme: Theme) => {
    const iconSwitcherState = useSharedValue<PaginationState>(PaginationState.NotActive);

    React.useEffect(() => {
        if (active && iconSwitcherState.value !== PaginationState.Active) {
            iconSwitcherState.value = PaginationState.Active;
        } else if (!active && iconSwitcherState.value !== PaginationState.NotActive) {
            iconSwitcherState.value = PaginationState.NotActive;
        }
    }, [active, iconSwitcherState]);

    const animatedValue = useDerivedValue(() => {
        return withSpring(iconSwitcherState.value, springConfig);
    });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(
                        animatedValue.value,
                        [PaginationState.NotActive, PaginationState.Active],
                        [1, 1.5],
                    ),
                },
            ],
            backgroundColor: interpolateColor(
                animatedValue.value,
                [PaginationState.NotActive, PaginationState.Active],
                [
                    theme[UIBackgroundViewColors.BackgroundNeutral] as string,
                    theme[UIBackgroundViewColors.BackgroundAccent] as string,
                ],
            ),
        };
    });

    return {
        animatedStyles,
    };
};
