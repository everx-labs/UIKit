import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable/types';

export enum UIWideBoxButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
    Nulled = 'Nulled',
}

export const contentColors: Record<
    'primaryBackground' | 'primaryContent' | 'secondary' | 'nulled',
    PressableColors
> = {
    primaryBackground: {
        initialColor: ColorVariants.BackgroundAccent,
        pressedColor: ColorVariants.SpecialAccentDark,
        hoveredColor: ColorVariants.SpecialAccentLight,
        disabledColor: ColorVariants.BackgroundAccent,
        loadingColor: ColorVariants.BackgroundAccent,
    },
    primaryContent: {
        initialColor: ColorVariants.StaticTextPrimaryLight,
        pressedColor: ColorVariants.StaticTextPrimaryLight,
        hoveredColor: ColorVariants.StaticTextPrimaryLight,
        disabledColor: ColorVariants.TextOverlayInverted,
        loadingColor: ColorVariants.TextOverlayInverted,
    },
    secondary: {
        initialColor: ColorVariants.BackgroundAccent,
        pressedColor: ColorVariants.SpecialAccentDark,
        hoveredColor: ColorVariants.SpecialAccentLight,
        disabledColor: ColorVariants.TextSecondary,
        loadingColor: ColorVariants.TextSecondary,
    },
    nulled: {
        initialColor: ColorVariants.TextPrimary,
        pressedColor: ColorVariants.TextAccent,
        hoveredColor: ColorVariants.SpecialAccentLight,
        disabledColor: ColorVariants.TextSecondary,
        loadingColor: ColorVariants.TextSecondary,
    },
};
