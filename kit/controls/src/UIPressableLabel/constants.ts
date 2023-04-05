import { ColorVariants } from '@tonlabs/uikit.themes';

import type { PressableColors } from '../Pressable';

export const defaultUIPressableLabelColors: PressableColors = {
    initialColor: ColorVariants.TextTertiary,
    pressedColor: ColorVariants.TextSecondary,
    hoveredColor: ColorVariants.TextPrimary,
    disabledColor: ColorVariants.TextTertiary,
    loadingColor: ColorVariants.TextTertiary,
};
