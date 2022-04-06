import * as React from 'react';
import { useAnimatedColor } from '../useAnimatedColor';
import {
    PressableStateVariant,
    pressableWithSpringConfig,
    PressableStateContext,
} from './constants';
import { usePressableColorScheme } from './hooks';
import type { PressableColors, PressableColorScheme } from './types';

export function usePressableContentColor({
    initialColor,
    pressedColor,
    hoveredColor,
    disabledColor,
}: PressableColors) {
    const pressableState = React.useContext(PressableStateContext);
    const colorScheme: PressableColorScheme = usePressableColorScheme(
        initialColor,
        pressedColor,
        hoveredColor,
        disabledColor,
    );

    const color = React.useMemo(() => {
        switch (pressableState) {
            case PressableStateVariant.Disabled:
                return colorScheme.disabledColor;
            case PressableStateVariant.Hovered:
                return colorScheme.hoveredColor;
            case PressableStateVariant.Pressed:
                return colorScheme.pressedColor;
            case PressableStateVariant.Initial:
            default:
                return colorScheme.initialColor;
        }
    }, [pressableState, colorScheme]);

    const animatedColor = useAnimatedColor(color, pressableWithSpringConfig);

    return animatedColor;
}
