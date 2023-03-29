import type { PressableColors } from '@tonlabs/uikit.controls';
import { ColorVariants } from '@tonlabs/uikit.themes';

export const defaultPressableChildColors: PressableColors = {
    initialColor: ColorVariants.TextPrimary,
    pressedColor: ColorVariants.TextTertiary,
    hoveredColor: ColorVariants.TextSecondary,
    disabledColor: ColorVariants.TextTertiary,
    loadingColor: ColorVariants.TextTertiary,
};
