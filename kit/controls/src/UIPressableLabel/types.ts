import type { UILabelProps } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable';

export type UIPressableLabelProps = Omit<UILabelProps, 'color'> & {
    /**
     * Text to display.
     */
    children: string | undefined;
    /**
     * Callback that is called when the text is pressed.
     * Used only for web.
     */
    onPress?: () => void | undefined;
    /**
     * If you want to use your own colors, you can pass them here.
     * @default
     * ```ts
     *  {
     *      initialColor: ColorVariants.TextSecondary,
     *      pressedColor: ColorVariants.TextTertiary,
     *      hoveredColor: ColorVariants.TextPrimary,
     *      disabledColor: ColorVariants.TextTertiary,
     *      loadingColor: ColorVariants.TextTertiary,
     *  }
     * ```
     */
    colors: PressableColors;
};

export type UIPressableLabelContentProps = Omit<UIPressableLabelProps, 'onPress'>;
