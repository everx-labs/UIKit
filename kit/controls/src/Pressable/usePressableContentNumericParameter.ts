import * as React from 'react';
import type Animated from 'react-native-reanimated';
import { useSharedValue, withSpring, WithSpringConfig } from 'react-native-reanimated';
import {
    PressableStateVariant,
    pressableWithSpringConfig,
    PressableStateContext,
} from './constants';
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

    const scale = React.useMemo(() => {
        switch (pressableState) {
            case PressableStateVariant.Disabled:
                return disabled;
            case PressableStateVariant.Hovered:
                return hovered;
            case PressableStateVariant.Pressed:
                return pressed;
            case PressableStateVariant.Loading:
                return loading;
            case PressableStateVariant.Initial:
            default:
                return initial;
        }
    }, [pressableState, initial, pressed, hovered, disabled, loading]);

    const animatedScale = useSharedValue(scale);

    React.useEffect(() => {
        animatedScale.value = withSpring(scale, withSpringConfig);
    }, [scale, animatedScale, withSpringConfig]);

    return animatedScale;
}
