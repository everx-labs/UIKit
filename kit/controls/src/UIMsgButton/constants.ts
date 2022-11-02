import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable';

export enum UIMsgButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
}

export enum UIMsgButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

export enum UIMsgButtonCornerPosition {
    BottomLeft = 'BottomLeft',
    BottomRight = 'BottomRight',
    TopLeft = 'TopLeft',
    TopRight = 'TopRight',
}

export enum UIMsgButtonIconPosition {
    Left = 'Left',
    Middle = 'Middle',
    Right = 'Right',
}

const PrimaryContent: PressableColors = {
    initialColor: ColorVariants.StaticTextPrimaryLight,
    pressedColor: ColorVariants.StaticTextPrimaryLight,
    hoveredColor: ColorVariants.StaticTextPrimaryLight,
    disabledColor: ColorVariants.TextTertiary,
    loadingColor: ColorVariants.StaticTextPrimaryLight,
};
const TransparentColors: PressableColors = {
    initialColor: ColorVariants.Transparent,
    pressedColor: ColorVariants.Transparent,
    hoveredColor: ColorVariants.Transparent,
    disabledColor: ColorVariants.Transparent,
    loadingColor: ColorVariants.Transparent,
};

export const BackgroundOverlayColors: PressableColors = {
    initialColor: ColorVariants.Transparent,
    pressedColor: ColorVariants.StaticPressOverlay,
    hoveredColor: ColorVariants.StaticHoverOverlay,
    disabledColor: ColorVariants.Transparent,
    loadingColor: ColorVariants.Transparent,
};

export const ContentColors: Record<
    UIMsgButtonType,
    Record<UIMsgButtonVariant, Record<'background' | 'content' | 'border', PressableColors>>
> = {
    [UIMsgButtonType.Primary]: {
        [UIMsgButtonVariant.Neutral]: {
            background: {
                initialColor: ColorVariants.BackgroundAccent,
                pressedColor: ColorVariants.BackgroundAccent,
                hoveredColor: ColorVariants.BackgroundAccent,
                disabledColor: ColorVariants.BackgroundAccent,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
            content: PrimaryContent,
            border: TransparentColors,
        },
        [UIMsgButtonVariant.Negative]: {
            background: {
                initialColor: ColorVariants.BackgroundNegative,
                pressedColor: ColorVariants.BackgroundNegative,
                hoveredColor: ColorVariants.BackgroundNegative,
                disabledColor: ColorVariants.BackgroundNegative,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
            content: PrimaryContent,
            border: TransparentColors,
        },
        [UIMsgButtonVariant.Positive]: {
            background: {
                initialColor: ColorVariants.BackgroundPositive,
                pressedColor: ColorVariants.BackgroundPositive,
                hoveredColor: ColorVariants.BackgroundPositive,
                disabledColor: ColorVariants.BackgroundPositive,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
            content: PrimaryContent,
            border: TransparentColors,
        },
    },
    [UIMsgButtonType.Secondary]: {
        [UIMsgButtonVariant.Neutral]: {
            background: TransparentColors,
            content: {
                initialColor: ColorVariants.TextAccent,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextSecondary,
                loadingColor: ColorVariants.TextSecondary,
            },
            border: {
                initialColor: ColorVariants.LineAccent,
                pressedColor: ColorVariants.LineNeutral,
                hoveredColor: ColorVariants.LineNeutral,
                disabledColor: ColorVariants.BackgroundTertiary,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
        },
        [UIMsgButtonVariant.Negative]: {
            background: TransparentColors,
            content: {
                initialColor: ColorVariants.TextNegative,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextSecondary,
                loadingColor: ColorVariants.TextSecondary,
            },
            border: {
                initialColor: ColorVariants.LineNegative,
                pressedColor: ColorVariants.LineNeutral,
                hoveredColor: ColorVariants.LineNeutral,
                disabledColor: ColorVariants.BackgroundTertiary,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
        },
        [UIMsgButtonVariant.Positive]: {
            background: TransparentColors,
            content: {
                initialColor: ColorVariants.TextPositive,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextSecondary,
                loadingColor: ColorVariants.TextSecondary,
            },
            border: {
                initialColor: ColorVariants.LinePositive,
                pressedColor: ColorVariants.LineNeutral,
                hoveredColor: ColorVariants.LineNeutral,
                disabledColor: ColorVariants.BackgroundTertiary,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
        },
    },
};
