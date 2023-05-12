import * as React from 'react';
import type Animated from 'react-native-reanimated';
import { useAnimatedProps } from 'react-native-reanimated';
import type { AnimatedImageTintColorProps } from './types';

/**
 * This hook is used to animate image colors.
 *
 * There is a bug in reanimated v2 on web, which causes the animatedProps to not work properly with tint color.
 * When the user changes the screen, and then returns back,
 * the image resets the tint color to one that was at the first render.
 *
 * The implementation for native remains unchanged.
 */
export function usePressableAnimatedImageTintColorProps(
    contentColor: Animated.SharedValue<string>,
): AnimatedImageTintColorProps {
    const animatedProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value,
        };
    });

    return React.useMemo(() => ({ animatedProps }), [animatedProps]);
}
