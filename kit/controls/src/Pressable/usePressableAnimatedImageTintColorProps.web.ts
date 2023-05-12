import * as React from 'react';
import type Animated from 'react-native-reanimated';
import { useAnimatedReaction } from 'react-native-reanimated';
import type { AnimatedImageTintColorProps } from './types';

/**
 * This hook is used to animate image colors.
 *
 * There is a bug in reanimated v2 on web, which causes the animatedProps to not work properly with tint color.
 * When the user changes the screen, and then returns back,
 * the image resets the tint color to one that was at the first render.
 *
 * So we use the tintColor prop instead of animatedProps for web.
 */
export function usePressableAnimatedImageTintColorProps(
    contentColor: Animated.SharedValue<string>,
): AnimatedImageTintColorProps {
    const [tintColor, setTintColor] = React.useState(contentColor.value);

    useAnimatedReaction(
        () => ({ contentColor: contentColor.value }),
        (current, previous) => {
            if (!previous || current.contentColor !== previous.contentColor) {
                setTintColor(current.contentColor);
            }
        },
    );

    return { tintColor };
}
