import * as React from 'react';
import { useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import type { ColorValue } from 'react-native';
import type { PressableColorScheme } from '../types';

function getStringColor(theme: Theme, color: ColorVariants | undefined): string {
    let colorValue: ColorValue;
    if (color == null) {
        colorValue = theme[ColorVariants.Transparent];
    } else {
        colorValue = theme[color];
    }
    return typeof colorValue === 'string' ? colorValue : colorValue.toString();
}

export function usePressableColorScheme(
    initialColor?: ColorVariants,
    pressedColor?: ColorVariants,
    hoveredColor?: ColorVariants,
    disabledColor?: ColorVariants,
): PressableColorScheme {
    const theme = useTheme();
    return React.useMemo(() => {
        return {
            initialColor: getStringColor(theme, initialColor),
            pressedColor: getStringColor(theme, pressedColor),
            hoveredColor: getStringColor(theme, hoveredColor),
            disabledColor: getStringColor(theme, disabledColor),
        };
    }, [disabledColor, hoveredColor, initialColor, pressedColor, theme]);
}
