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
            initialColor: ColorVariants.BackgroundSecondary,
            pressedColor: ColorVariants.BackgroundSecondary,
            hoveredColor: ColorVariants.BackgroundSecondary,
            disabledColor: ColorVariants.BackgroundSecondary,
            loadingColor: ColorVariants.BackgroundSecondary,
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
            disabledColor: ColorVariants.BackgroundTertiary,
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
