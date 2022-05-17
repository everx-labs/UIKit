import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable';

export enum UILinkButtonType {
    Link = 'Link',
    Menu = 'Menu',
}

export enum UILinkButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

export enum UILinkButtonSize {
    Small = 'Small',
    Normal = 'Normal',
}

export enum UILinkButtonIconPosition {
    Left = 'Left',
    Middle = 'Middle',
    Right = 'Right',
}

export const ContentColors: Record<
    UILinkButtonType,
    Record<UILinkButtonVariant, Record<'content', PressableColors>>
> = {
    [UILinkButtonType.Link]: {
        [UILinkButtonVariant.Neutral]: {
            content: {
                initialColor: ColorVariants.TextAccent,
                pressedColor: ColorVariants.SpecialAccentDark,
                hoveredColor: ColorVariants.SpecialAccentLight,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextAccent,
            },
        },
        [UILinkButtonVariant.Negative]: {
            content: {
                initialColor: ColorVariants.TextNegative,
                pressedColor: ColorVariants.SpecialAccentDark,
                hoveredColor: ColorVariants.SpecialAccentLight,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextNegative,
            },
        },
        [UILinkButtonVariant.Positive]: {
            content: {
                initialColor: ColorVariants.TextPositive,
                pressedColor: ColorVariants.SpecialAccentDark,
                hoveredColor: ColorVariants.SpecialAccentLight,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextPositive,
            },
        },
    },
    [UILinkButtonType.Menu]: {
        [UILinkButtonVariant.Neutral]: {
            content: {
                initialColor: ColorVariants.TextPrimary,
                pressedColor: ColorVariants.SpecialAccentDark,
                hoveredColor: ColorVariants.SpecialAccentLight,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextPrimary,
            },
        },
        [UILinkButtonVariant.Negative]: {
            content: {
                initialColor: ColorVariants.TextNegative,
                pressedColor: ColorVariants.SpecialAccentDark,
                hoveredColor: ColorVariants.SpecialAccentLight,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextNegative,
            },
        },
        [UILinkButtonVariant.Positive]: {
            content: {
                initialColor: ColorVariants.TextPositive,
                pressedColor: ColorVariants.SpecialAccentDark,
                hoveredColor: ColorVariants.SpecialAccentLight,
                disabledColor: ColorVariants.TextOverlay,
                loadingColor: ColorVariants.TextPositive,
            },
        },
    },
};
