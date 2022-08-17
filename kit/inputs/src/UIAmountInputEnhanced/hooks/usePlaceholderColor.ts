import * as React from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { ColorVariants, Theme } from '@tonlabs/uikit.themes';

export function usePlaceholderColor(
    theme: Theme,
    isPlaceholderVisible: SharedValue<boolean>,
    formattedText: SharedValue<string>,
    isHovered: SharedValue<boolean>,
    editable: boolean,
) {
    const placeholderJSColors = React.useMemo(() => {
        return {
            transparent: theme[ColorVariants.Transparent] as string,
            hover: theme[ColorVariants.TextSecondary] as string,
            default: theme[ColorVariants.TextTertiary] as string,
        };
    }, [theme]);
    const placeholderColors = useDerivedValue(() => {
        return {
            transparent: placeholderJSColors.transparent,
            hover: placeholderJSColors.hover,
            default: placeholderJSColors.default,
        };
    }, [placeholderJSColors]);
    return useDerivedValue(() => {
        if (!isPlaceholderVisible.value || formattedText.value) {
            return placeholderColors.value.transparent;
        }
        return isHovered.value && editable
            ? placeholderColors.value.hover
            : placeholderColors.value.default;
    }, [editable]);
}
