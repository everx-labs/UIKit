import type { PressableColors } from '@tonlabs/uikit.controls';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { InputColorScheme } from '../constants';

export const defaultInputColorScheme: InputColorScheme = InputColorScheme.Default;

export const inputChildrenPressableColors: Record<InputColorScheme, PressableColors> = {
    [InputColorScheme.Default]: {
        initialColor: ColorVariants.TextPrimary,
        pressedColor: ColorVariants.TextTertiary,
        hoveredColor: ColorVariants.TextSecondary,
        disabledColor: ColorVariants.TextTertiary,
        loadingColor: ColorVariants.TextTertiary,
    },
    [InputColorScheme.Secondary]: {
        initialColor: ColorVariants.TextSecondary,
        pressedColor: ColorVariants.TextTertiary,
        hoveredColor: ColorVariants.TextPrimary,
        disabledColor: ColorVariants.TextTertiary,
        loadingColor: ColorVariants.TextTertiary,
    },
};

export const inputChildrenTextColor = ColorVariants.TextTertiary;
