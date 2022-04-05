import * as React from 'react';
import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';
import type { ColorValue } from 'react-native';
import type { PressableColorScheme } from '../types';

function getStringValue(color: ColorValue): string {
    if (color == null) {
        console.error(
            `[usePressableColorScheme.ts]: "color" must be a ColorValue, but got ${color}`,
        );
        return '#000000';
    }
    return typeof color === 'string' ? color : color.toString();
}

export function usePressableColorScheme(
    disabledColor: ColorVariants,
    hoveredColor: ColorVariants,
    initialColor: ColorVariants,
    pressedColor: ColorVariants,
): PressableColorScheme {
    const theme = useTheme();
    return React.useMemo(() => {
        return {
            initialColor: getStringValue(theme[initialColor]),
            pressedColor: getStringValue(theme[pressedColor]),
            hoveredColor: getStringValue(theme[hoveredColor]),
            disabledColor: getStringValue(theme[disabledColor]),
        };
    }, [disabledColor, hoveredColor, initialColor, pressedColor, theme]);
}
