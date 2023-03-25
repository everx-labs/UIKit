import type { PressableColors } from '@tonlabs/uikit.controls';
import { ColorVariants } from '@tonlabs/uikit.themes';

import { InputMessageColorScheme } from './types';

export const inputMessageColors: Record<InputMessageColorScheme, PressableColors> = {
    [InputMessageColorScheme.Default]: {
        initialColor: ColorVariants.TextTertiary,
        pressedColor: ColorVariants.TextSecondary,
        hoveredColor: ColorVariants.TextPrimary,
        disabledColor: ColorVariants.TextTertiary,
        loadingColor: ColorVariants.TextTertiary,
    },
    [InputMessageColorScheme.Secondary]: {
        initialColor: ColorVariants.TextSecondary,
        pressedColor: ColorVariants.TextPrimary,
        hoveredColor: ColorVariants.TextBW,
        disabledColor: ColorVariants.TextSecondary,
        loadingColor: ColorVariants.TextSecondary,
    },
};
