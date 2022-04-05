import * as React from 'react';
import { PressableStateVariant } from '../constants';
import type { PressableColorScheme } from '../types';

export function useStateBackgroundColor(
    pressableState: PressableStateVariant,
    pressableColorScheme: PressableColorScheme,
): string {
    return React.useMemo<string>(() => {
        switch (pressableState) {
            case PressableStateVariant.Disabled:
                return typeof pressableColorScheme.disabledColor === 'string'
                    ? pressableColorScheme.disabledColor
                    : pressableColorScheme.disabledColor.toString();
            case PressableStateVariant.Hovered:
                return typeof pressableColorScheme.hoveredColor === 'string'
                    ? pressableColorScheme.hoveredColor
                    : pressableColorScheme.hoveredColor.toString();
            case PressableStateVariant.Pressed:
                return typeof pressableColorScheme.pressedColor === 'string'
                    ? pressableColorScheme.pressedColor
                    : pressableColorScheme.pressedColor.toString();
            case PressableStateVariant.Initial:
            default:
                return typeof pressableColorScheme.initialColor === 'string'
                    ? pressableColorScheme.initialColor
                    : pressableColorScheme.initialColor.toString();
        }
    }, [pressableState, pressableColorScheme]);
}
