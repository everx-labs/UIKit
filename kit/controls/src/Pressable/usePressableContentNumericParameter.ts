import * as React from 'react';
import type Animated from 'react-native-reanimated';
import { useDerivedValue, withSpring, WithSpringConfig } from 'react-native-reanimated';
import { pressableWithSpringConfig, PressableStateContext } from './constants';
import type { PressableNumericParameters } from './types';

/**
 * This hook is used to animate child components.
 * You can use this number for any animation on `react-native-reanimated`
 * to animate any property you need.
 * For example `scale`, `opacity`, etc.
 *
 * NOTE: You can use it only in child components of the Pressable component.
 *
 * @returns the current animated value of numeric parameter,
 * which depends on the state of the parent Pressable component.
 */
export function usePressableContentNumericParameter(
    {
        initial = 1,
        pressed = 1,
        hovered = 1,
        disabled = 1,
        loading = 1,
    }: PressableNumericParameters,
    withSpringConfig: WithSpringConfig = pressableWithSpringConfig,
): Readonly<Animated.SharedValue<number>> {
    const pressableState = React.useContext(PressableStateContext);

    const scale = useDerivedValue(() => {
        switch (pressableState?.value) {
            case 'Disabled':
                return disabled;
            case 'Hovered':
                return hovered;
            case 'Pressed':
                return pressed;
            case 'Loading':
                return loading;
            case 'Initial':
            default:
                return initial;
        }
    }, [initial, pressed, hovered, disabled, loading]);

    const animatedScale = useDerivedValue(() => {
        return withSpring(scale.value, withSpringConfig);
    }, []);

    return animatedScale;
}
