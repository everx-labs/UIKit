import React from 'react';
import Animated, {
    withSpring,
    useDerivedValue,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { UIConstant } from '../../constants';

import { PaginationState } from '../types';

/**
 * Base duration of timing animations in component
 */
export const duration = 400;

/**
 * Config of any spring animations in component
 */
const springConfig: Animated.WithSpringConfig = {
    damping: 10,
    stiffness: 100,
    mass: 1,
    overshootClamping: true,
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
export const usePaginationStyle = (active: boolean) => {
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
                        [
                            UIConstant.carousel.circleScale.notActive,
                            UIConstant.carousel.circleScale.Active,
                        ],
                    ),
                },
            ],
        };
    });

    return {
        animatedStyles,
    };
};
