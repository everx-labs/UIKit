import { useMemo } from 'react';

import { ColorVariants, useTheme } from './Colors';
import { useColorParts } from './useColorParts';

const SHADE_FACTOR = 0.25;

export function useColorShades(color: ColorVariants) {
    const colorThemedValue = useTheme()[color];
    const { colorPartsArray } = useColorParts(color);

    return useMemo(() => {
        if (colorPartsArray == null) {
            return { color: colorThemedValue };
        }

        const [r, g, b] = colorPartsArray;

        const darkenColorValue = [
            Math.floor(r * (1 - SHADE_FACTOR)),
            Math.floor(g * (1 - SHADE_FACTOR)),
            Math.floor(b * (1 - SHADE_FACTOR)),
        ].reduce((acc, v) => {
            const hex = v.toString(16);
            return acc + (hex.length === 1 ? `0${hex}` : hex);
        }, '#');

        const lightenColorValue = [
            Math.floor(r + (255 - r) * SHADE_FACTOR),
            Math.floor(g + (255 - g) * SHADE_FACTOR),
            Math.floor(b + (255 - b) * SHADE_FACTOR),
        ].reduce((acc, v) => {
            const hex = v.toString(16);
            return acc + (hex.length === 1 ? `0${hex}` : hex);
        }, '#');

        return {
            color: colorThemedValue,
            darken: darkenColorValue,
            lighten: lightenColorValue,
        };
    }, [colorThemedValue, colorPartsArray]);
}
