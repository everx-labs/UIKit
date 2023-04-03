import type { PressableColors } from '@tonlabs/uikit.controls';
import { ColorVariants } from '@tonlabs/uikit.themes';

import { InputChildrenColorScheme } from './types';

export const defaultInputColorScheme: InputChildrenColorScheme = InputChildrenColorScheme.Default;

export const inputChildrenColors: Record<InputChildrenColorScheme, PressableColors> = {
    [InputChildrenColorScheme.Default]: {
        initialColor: ColorVariants.TextPrimary,
        pressedColor: ColorVariants.TextTertiary,
        hoveredColor: ColorVariants.TextSecondary,
        disabledColor: ColorVariants.TextTertiary,
        loadingColor: ColorVariants.TextTertiary,
    },
    [InputChildrenColorScheme.Secondary]: {
        initialColor: ColorVariants.TextSecondary,
        pressedColor: ColorVariants.TextTertiary,
        hoveredColor: ColorVariants.TextPrimary,
        disabledColor: ColorVariants.TextTertiary,
        loadingColor: ColorVariants.TextTertiary,
    },
};
