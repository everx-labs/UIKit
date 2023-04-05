import type { PressableColors } from '@tonlabs/uikit.controls';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { InputColorScheme } from '../constants';

export const inputMessageColors: Record<InputColorScheme, PressableColors> = {
    [InputColorScheme.Default]: {
        initialColor: ColorVariants.TextTertiary,
        pressedColor: ColorVariants.TextSecondary,
        hoveredColor: ColorVariants.TextPrimary,
        disabledColor: ColorVariants.TextTertiary,
        loadingColor: ColorVariants.TextTertiary,
    },
    [InputColorScheme.Secondary]: {
        initialColor: ColorVariants.TextSecondary,
        pressedColor: ColorVariants.TextTertiary,
        hoveredColor: ColorVariants.TextBW,
        disabledColor: ColorVariants.TextSecondary,
        loadingColor: ColorVariants.TextSecondary,
    },
};
