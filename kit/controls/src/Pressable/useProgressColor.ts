import * as React from 'react';
import { useAnimatedColor } from '../useAnimatedColor';
import {
    PressableStateVariant,
    pressableWithSpringConfig,
    PressableStateContext,
} from './constants';
import type { PressableColorScheme } from './types';

export function useProgressColor(colorScheme: PressableColorScheme) {
    const pressableState = React.useContext(PressableStateContext);

    const color = React.useMemo(() => {
        switch (pressableState) {
            case PressableStateVariant.Disabled:
                return typeof colorScheme.disabledColor === 'string'
                    ? colorScheme.disabledColor
                    : colorScheme.disabledColor.toString();
            case PressableStateVariant.Hovered:
                return typeof colorScheme.hoveredColor === 'string'
                    ? colorScheme.hoveredColor
                    : colorScheme.hoveredColor.toString();
            case PressableStateVariant.Pressed:
                return typeof colorScheme.pressedColor === 'string'
                    ? colorScheme.pressedColor
                    : colorScheme.pressedColor.toString();
            case PressableStateVariant.Initial:
            default:
                return typeof colorScheme.initialColor === 'string'
                    ? colorScheme.initialColor
                    : colorScheme.initialColor.toString();
        }
    }, [pressableState, colorScheme]);

    const animatedColor = useAnimatedColor(color, pressableWithSpringConfig);

    return animatedColor;
}
