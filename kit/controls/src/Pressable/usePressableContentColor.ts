import * as React from 'react';
import type Animated from 'react-native-reanimated';
import { useDerivedValue, withSpring } from 'react-native-reanimated';
import { pressableWithSpringConfig, PressableStateContext } from './constants';
import { usePressableColorScheme } from './hooks';
import type { PressableColors, PressableColorScheme } from './types';

/**
 * This hook is used to animate child components colors.
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

    const color = useDerivedValue(() => {
        switch (pressableState?.value) {
            case 'Disabled':
                return colorScheme.disabledColor;
            case 'Hovered':
                return colorScheme.hoveredColor;
            case 'Pressed':
                return colorScheme.pressedColor;
            case 'Loading':
                return colorScheme.loadingColor;
            case 'Initial':
            default:
                return colorScheme.initialColor;
        }
    }, [pressableState, colorScheme]);

    const animatedColor = useDerivedValue(() => {
        return withSpring(color.value, pressableWithSpringConfig);
    });

    return animatedColor;
}
