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
                return pressableColorScheme.disabledColor;
            case PressableStateVariant.Hovered:
                return pressableColorScheme.hoveredColor;
            case PressableStateVariant.Pressed:
                return pressableColorScheme.pressedColor;
            case PressableStateVariant.Initial:
            default:
                return pressableColorScheme.initialColor;
        }
    }, [pressableState, pressableColorScheme]);
}
