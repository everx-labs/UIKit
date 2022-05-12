import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable';

export enum UIActionButtonType {
    Primary = 'Primary',
    Accent = 'Accent',
}

export const contentColors: Record<
    UIActionButtonType,
    Record<'background' | 'content', PressableColors>
> = {
    [UIActionButtonType.Primary]: {
        background: {
            initialColor: ColorVariants.BackgroundBW,
            pressedColor: ColorVariants.BackgroundBW,
            hoveredColor: ColorVariants.BackgroundBW,
            disabledColor: ColorVariants.BackgroundBW,
            loadingColor: ColorVariants.BackgroundBW,
        },
        content: {
            initialColor: ColorVariants.TextAccent,
            pressedColor: ColorVariants.SpecialAccentDark,
            hoveredColor: ColorVariants.SpecialAccentLight,
            disabledColor: ColorVariants.TextTertiary,
            loadingColor: ColorVariants.TextAccent,
        },
    },
    [UIActionButtonType.Accent]: {
        background: {
            initialColor: ColorVariants.BackgroundAccent,
            pressedColor: ColorVariants.SpecialAccentDark,
            hoveredColor: ColorVariants.SpecialAccentLight,
            disabledColor: ColorVariants.BackgroundNeutral,
            loadingColor: ColorVariants.BackgroundAccent,
        },
        content: {
            initialColor: ColorVariants.StaticTextPrimaryLight,
            pressedColor: ColorVariants.StaticTextPrimaryLight,
            hoveredColor: ColorVariants.StaticTextPrimaryLight,
            disabledColor: ColorVariants.StaticTextOverlayLight,
            loadingColor: ColorVariants.StaticTextPrimaryLight,
        },
    },
};
