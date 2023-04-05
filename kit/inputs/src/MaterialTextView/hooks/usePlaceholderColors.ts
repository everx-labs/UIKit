import * as React from 'react';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { InputColorScheme } from '../../Common';

export function usePlaceholderColors(colorScheme: InputColorScheme) {
    return React.useMemo(() => {
        switch (colorScheme) {
            case InputColorScheme.Secondary:
                return {
                    transparent: ColorVariants.Transparent,
                    hover: ColorVariants.TextBW,
                    default: ColorVariants.TextSecondary,
                };
            case InputColorScheme.Default:
            default:
                return {
                    transparent: ColorVariants.Transparent,
                    hover: ColorVariants.TextSecondary,
                    default: ColorVariants.TextTertiary,
                };
        }
    }, [colorScheme]);
}
