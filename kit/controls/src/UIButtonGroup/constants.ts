import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable';

// eslint-disable-next-line no-shadow
export enum UIButtonGroupActionIconPosition {
    Left = 'Left',
    Right = 'Right',
}

export const ContentColors: PressableColors = {
    initialColor: ColorVariants.TextPrimary,
    pressedColor: ColorVariants.SpecialAccentDark,
    hoveredColor: ColorVariants.SpecialAccentLight,
    disabledColor: ColorVariants.TextOverlay,
    loadingColor: ColorVariants.TextPrimary,
};

export const UILayoutConstants = {
    containerBorderRadius: 12,
};
