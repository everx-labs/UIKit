import * as React from 'react';
import type Animated from 'react-native-reanimated';
import { useAnimatedColor } from './hooks/useAnimatedColor';
import {
    PressableStateVariant,
    pressableWithSpringConfig,
    PressableStateContext,
} from './constants';
import { usePressableColorScheme } from './hooks';
import type { PressableColors, PressableColorScheme } from './types';

/**
 * This hooks is used to animate child components colors.
 *
 * NOTE: You can use it only in child components of the Pressable component.
 * @returns the current color, which depends on the state of the parent Pressable component.
 */
export function usePressableContentColor({
    initialColor,
    pressedColor,
    hoveredColor,
    disabledColor,
    loadingColor,
}: PressableColors): Readonly<Animated.SharedValue<string | number>> {
    const pressableState = React.useContext(PressableStateContext);
    const colorScheme: PressableColorScheme = usePressableColorScheme(
        initialColor,
        pressedColor,
        hoveredColor,
        disabledColor,
        loadingColor,
    );

    const color = React.useMemo(() => {
        switch (pressableState) {
            case PressableStateVariant.Disabled:
                return colorScheme.disabledColor;
            case PressableStateVariant.Hovered:
                return colorScheme.hoveredColor;
            case PressableStateVariant.Pressed:
                return colorScheme.pressedColor;
            case PressableStateVariant.Loading:
                return colorScheme.loadingColor;
            case PressableStateVariant.Initial:
            default:
                return colorScheme.initialColor;
        }
    }, [pressableState, colorScheme]);

    const animatedColor = useAnimatedColor(color, pressableWithSpringConfig);

    return animatedColor;
}
