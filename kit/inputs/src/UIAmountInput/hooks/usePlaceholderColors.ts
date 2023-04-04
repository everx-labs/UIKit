import * as React from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { ColorVariants, Theme } from '@tonlabs/uikit.themes';
import { InputColorScheme } from '../../Common';

export function usePlaceholderColors(theme: Theme, colorScheme: InputColorScheme) {
    const placeholderJSColors = React.useMemo(() => {
        switch (colorScheme) {
            case InputColorScheme.Secondary:
                return {
                    transparent: theme[ColorVariants.Transparent] as string,
                    hover: theme[ColorVariants.TextBW] as string,
                    default: theme[ColorVariants.TextSecondary] as string,
                };
            case InputColorScheme.Default:
            default:
                return {
                    transparent: theme[ColorVariants.Transparent] as string,
                    hover: theme[ColorVariants.TextSecondary] as string,
                    default: theme[ColorVariants.TextTertiary] as string,
                };
        }
    }, [theme, colorScheme]);
    return useDerivedValue(() => {
        return {
            transparent: placeholderJSColors.transparent,
            hover: placeholderJSColors.hover,
            default: placeholderJSColors.default,
        };
    }, [placeholderJSColors]);
}
