import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable';

export enum UIPillButtonIconPosition {
    Left = 'Left',
    Right = 'Right',
}

export enum UIPillButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

export const BackgroundOverlayColors: PressableColors = {
    initialColor: ColorVariants.Transparent,
    pressedColor: ColorVariants.StaticPressOverlay,
    hoveredColor: ColorVariants.StaticHoverOverlay,
    disabledColor: ColorVariants.Transparent,
    loadingColor: ColorVariants.Transparent,
};

export const ContentColors: Record<
    UIPillButtonVariant,
    Record<'background' | 'content', PressableColors>
> = {
    [UIPillButtonVariant.Neutral]: {
        background: {
            initialColor: ColorVariants.BackgroundAccent,
            pressedColor: ColorVariants.BackgroundAccent,
            hoveredColor: ColorVariants.BackgroundAccent,
            disabledColor: ColorVariants.BackgroundAccent,
            loadingColor: ColorVariants.BackgroundNeutral,
        },
        content: {
            initialColor: ColorVariants.StaticTextPrimaryLight,
            pressedColor: ColorVariants.StaticTextPrimaryLight,
            hoveredColor: ColorVariants.StaticTextPrimaryLight,
            disabledColor: ColorVariants.TextOverlayInverted,
            loadingColor: ColorVariants.StaticTextPrimaryLight,
        },
    },
    [UIPillButtonVariant.Negative]: {
        background: {
            initialColor: ColorVariants.BackgroundNegative,
            pressedColor: ColorVariants.BackgroundNegative,
            hoveredColor: ColorVariants.BackgroundNegative,
            disabledColor: ColorVariants.BackgroundNegative,
            loadingColor: ColorVariants.BackgroundNeutral,
        },
        content: {
            initialColor: ColorVariants.StaticTextPrimaryLight,
            pressedColor: ColorVariants.StaticTextPrimaryLight,
            hoveredColor: ColorVariants.StaticTextPrimaryLight,
            disabledColor: ColorVariants.TextOverlayInverted,
            loadingColor: ColorVariants.StaticTextPrimaryLight,
        },
    },
    [UIPillButtonVariant.Positive]: {
        background: {
            initialColor: ColorVariants.BackgroundPositive,
            pressedColor: ColorVariants.BackgroundPositive,
            hoveredColor: ColorVariants.BackgroundPositive,
            disabledColor: ColorVariants.BackgroundPositive,
            loadingColor: ColorVariants.BackgroundNeutral,
        },
        content: {
            initialColor: ColorVariants.StaticTextPrimaryLight,
            pressedColor: ColorVariants.StaticTextPrimaryLight,
            hoveredColor: ColorVariants.StaticTextPrimaryLight,
            disabledColor: ColorVariants.TextOverlayInverted,
            loadingColor: ColorVariants.StaticTextPrimaryLight,
        },
    },
};
