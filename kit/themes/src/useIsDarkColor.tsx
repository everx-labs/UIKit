import { useMemo } from 'react';

import { useColorParts } from './useColorParts';
import type { ColorVariants } from './Colors';

export function useIsDarkColor(color: ColorVariants) {
    const { colorPartsArray } = useColorParts(color);

    return useMemo(() => {
        if (colorPartsArray == null) {
            return false;
        }

        const [r, g, b] = colorPartsArray;

        // ---
        // https://github.com/gion/is-dark-color/blob/master/src/isDarkColor.js#L14-L24
        // Based on https://www.w3.org/TR/WCAG20/#relativeluminancedef

        const colorArray = [r / 255, g / 255, b / 255].map(v => {
            if (v <= 0.03928) {
                return v / 12.92;
            }

            // eslint-disable-next-line no-restricted-properties
            return ((v + 0.055) / 1.055) ** 2.4;
        });

        const luminance = 0.2126 * colorArray[0] + 0.7152 * colorArray[1] + 0.0722 * colorArray[2];

        return luminance <= 0.179;
        // ---
    }, [colorPartsArray]);
}
