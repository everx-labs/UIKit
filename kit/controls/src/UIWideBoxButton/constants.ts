import { ColorVariants } from '@tonlabs/uikit.themes';

export enum UIWideBoxButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
    Nulled = 'Nulled',
}

export const contentColors = {
    primary: {
        initialColor: ColorVariants.BackgroundAccent,
        pressedColor: ColorVariants.SpecialAccentDark,
        hoveredColor: ColorVariants.SpecialAccentLight,
        disabledColor: ColorVariants.BackgroundNeutral,
    },
    secondary: {
        initialColor: ColorVariants.BackgroundAccent,
        pressedColor: ColorVariants.SpecialAccentDark,
        hoveredColor: ColorVariants.SpecialAccentLight,
        disabledColor: ColorVariants.BackgroundNeutral,
    },
    nulled: {
        initialColor: ColorVariants.TextPrimary,
        pressedColor: ColorVariants.TextAccent,
        hoveredColor: ColorVariants.SpecialAccentLight,
        disabledColor: ColorVariants.TextOverlay,
    },
};
