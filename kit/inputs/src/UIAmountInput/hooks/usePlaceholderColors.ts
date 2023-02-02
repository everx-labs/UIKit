import * as React from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { ColorVariants, Theme } from '@tonlabs/uikit.themes';

export function usePlaceholderColors(theme: Theme) {
    const placeholderJSColors = React.useMemo(() => {
        return {
            transparent: theme[ColorVariants.Transparent] as string,
            hover: theme[ColorVariants.TextSecondary] as string,
            default: theme[ColorVariants.TextTertiary] as string,
        };
    }, [theme]);
    return useDerivedValue(() => {
        return {
            transparent: placeholderJSColors.transparent,
            hover: placeholderJSColors.hover,
            default: placeholderJSColors.default,
        };
    }, [placeholderJSColors]);
}
