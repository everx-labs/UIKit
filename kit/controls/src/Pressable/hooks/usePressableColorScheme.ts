import * as React from 'react';
import type { Theme, ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColorScheme } from '../types';

export function usePressableColorScheme(
    theme: Theme,
    disabledColor: ColorVariants,
    hoveredColor: ColorVariants,
    initialColor: ColorVariants,
    pressedColor: ColorVariants,
): PressableColorScheme {
    return React.useMemo(() => {
        return {
            initialColor: theme[initialColor],
            pressedColor: theme[pressedColor],
            hoveredColor: theme[hoveredColor],
            disabledColor: theme[disabledColor],
        };
    }, [disabledColor, hoveredColor, initialColor, pressedColor, theme]);
}
