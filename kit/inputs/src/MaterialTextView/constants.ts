import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '@tonlabs/uikit.controls';

import { BackgroundColors, MaterialTextViewColorScheme } from './types';

export const UIConstants = {
    amount: {
        decimalAspect: {
            integer: 0,
            currency: 2,
            precision: 9,
        },
    },
};

export const defaultBackgroundColors: BackgroundColors = {
    regular: ColorVariants.BackgroundBW,
    disabled: ColorVariants.BackgroundTertiary,
};

export const defaultMaterialTextViewColorScheme: MaterialTextViewColorScheme =
    MaterialTextViewColorScheme.Default;

export const materialTextViewChildrenColors: Record<MaterialTextViewColorScheme, PressableColors> =
    {
        [MaterialTextViewColorScheme.Default]: {
            initialColor: ColorVariants.TextPrimary,
            pressedColor: ColorVariants.TextTertiary,
            hoveredColor: ColorVariants.TextSecondary,
            disabledColor: ColorVariants.TextTertiary,
            loadingColor: ColorVariants.TextTertiary,
        },
        [MaterialTextViewColorScheme.Secondary]: {
            initialColor: ColorVariants.TextSecondary,
            pressedColor: ColorVariants.TextTertiary,
            hoveredColor: ColorVariants.TextPrimary,
            disabledColor: ColorVariants.TextTertiary,
            loadingColor: ColorVariants.TextTertiary,
        },
    };
