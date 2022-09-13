import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable';

export enum UIBoxButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
    Tertiary = 'Tertiary',
    Nulled = 'Nulled',
}

export enum UIBoxButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

export enum UIBoxButtonIconPosition {
    Left = 'Left',
    Middle = 'Middle',
    Right = 'Right',
}

const PrimaryContent: PressableColors = {
    initialColor: ColorVariants.StaticTextPrimaryLight,
    pressedColor: ColorVariants.StaticTextPrimaryLight,
    hoveredColor: ColorVariants.StaticTextPrimaryLight,
    disabledColor: ColorVariants.TextOverlayInverted,
    loadingColor: ColorVariants.StaticTextPrimaryLight,
};
const SecondaryBackground: PressableColors = {
    initialColor: ColorVariants.BackgroundSecondary,
    pressedColor: ColorVariants.BackgroundTertiary,
    hoveredColor: ColorVariants.BackgroundTertiary,
    disabledColor: ColorVariants.TextOverlayInverted,
    loadingColor: ColorVariants.BackgroundTertiary,
};
const TransparentBackground: PressableColors = {
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
    UIBoxButtonType,
    Record<UIBoxButtonVariant, Record<'background' | 'content', PressableColors>>
> = {
    [UIBoxButtonType.Primary]: {
        [UIBoxButtonVariant.Neutral]: {
            background: {
                initialColor: ColorVariants.BackgroundAccent,
                pressedColor: ColorVariants.BackgroundAccent,
                hoveredColor: ColorVariants.BackgroundAccent,
                disabledColor: ColorVariants.BackgroundAccent,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
            content: PrimaryContent,
        },
        [UIBoxButtonVariant.Negative]: {
            background: {
                initialColor: ColorVariants.BackgroundNegative,
                pressedColor: ColorVariants.BackgroundNegative,
                hoveredColor: ColorVariants.BackgroundNegative,
                disabledColor: ColorVariants.BackgroundNegative,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
            content: PrimaryContent,
        },
        [UIBoxButtonVariant.Positive]: {
            background: {
                initialColor: ColorVariants.BackgroundPositive,
                pressedColor: ColorVariants.BackgroundPositive,
                hoveredColor: ColorVariants.BackgroundPositive,
                disabledColor: ColorVariants.BackgroundPositive,
                loadingColor: ColorVariants.BackgroundTertiary,
            },
            content: PrimaryContent,
        },
    },
    [UIBoxButtonType.Secondary]: {
        [UIBoxButtonVariant.Neutral]: {
            background: SecondaryBackground,
            content: {
                initialColor: ColorVariants.TextPrimary,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextPrimary,
            },
        },
        [UIBoxButtonVariant.Negative]: {
            background: SecondaryBackground,
            content: {
                initialColor: ColorVariants.TextNegative,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextNegative,
            },
        },
        [UIBoxButtonVariant.Positive]: {
            background: SecondaryBackground,
            content: {
                initialColor: ColorVariants.TextPositive,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextPositive,
            },
        },
    },
    [UIBoxButtonType.Tertiary]: {
        [UIBoxButtonVariant.Neutral]: {
            background: TransparentBackground,
            content: {
                initialColor: ColorVariants.TextAccent,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextAccent,
            },
        },
        [UIBoxButtonVariant.Negative]: {
            background: TransparentBackground,
            content: {
                initialColor: ColorVariants.TextNegative,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextNegative,
            },
        },
        [UIBoxButtonVariant.Positive]: {
            background: TransparentBackground,
            content: {
                initialColor: ColorVariants.TextPositive,
                pressedColor: ColorVariants.TextPrimary,
                hoveredColor: ColorVariants.TextPrimary,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextPositive,
            },
        },
    },
    [UIBoxButtonType.Nulled]: {
        [UIBoxButtonVariant.Neutral]: {
            background: TransparentBackground,
            content: {
                initialColor: ColorVariants.TextPrimary,
                pressedColor: ColorVariants.TextAccent,
                hoveredColor: ColorVariants.TextAccent,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextPrimary,
            },
        },
        [UIBoxButtonVariant.Negative]: {
            background: TransparentBackground,
            content: {
                initialColor: ColorVariants.TextNegative,
                pressedColor: ColorVariants.TextAccent,
                hoveredColor: ColorVariants.TextAccent,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextNegative,
            },
        },
        [UIBoxButtonVariant.Positive]: {
            background: TransparentBackground,
            content: {
                initialColor: ColorVariants.TextPositive,
                pressedColor: ColorVariants.TextAccent,
                hoveredColor: ColorVariants.TextAccent,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextPositive,
            },
        },
    },
};
