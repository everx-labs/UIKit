import * as React from 'react';

import { ColorVariants, useTheme } from './Colors';

export function useColorParts(color: ColorVariants) {
    const currentColor = useTheme()[color] as string;

    return React.useMemo(() => {
        if (currentColor.indexOf('#') === 0) {
            // Hex
            const hexRegex = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i;

            // @ts-ignore
            const [, red, green, blue] = currentColor.match(hexRegex);

            return {
                colorParts: `${parseInt(red, 16)}, ${parseInt(
                    green,
                    16,
                )}, ${parseInt(blue, 16)}`,
                opacity: 1,
            };
        }

        if (currentColor.indexOf('rgb(') === 0) {
            const rgbRegex = /rgb\((\d+),\s+(\d+),\s+(\d+)\)/;

            // @ts-ignore
            const [, red, green, blue] = currentColor.match(rgbRegex);

            return {
                colorParts: `${red}, ${green}, ${blue}`,
                opacity: 1,
            };
        }

        if (currentColor.indexOf('rgba(') === 0) {
            const rgbaRegex = /rgba\((\d+),\s+(\d+),\s+(\d+),\s+([\d.]+)\)/;

            // @ts-ignore
            const [, red, green, blue, opacity] = currentColor.match(rgbaRegex);

            return {
                colorParts: `${red}, ${green}, ${blue}`,
                opacity: Number(opacity),
            };
        }

        return {
            color: currentColor,
            opacity: 1,
        };
    }, [currentColor]);
}
