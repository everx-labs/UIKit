import type BigNumber from 'bignumber.js';

import type { TypographyVariants } from '../Typography';
import type { ColorVariants } from '../Colors';
import type { UIImageProps } from '../UIImage';
import type { UINumberDecimalAspect } from './runOnUILocalizedNumberFormat';

// Appearance customization
export type UINumberAppearance = {
    /**
     * Text style preset from Typography for integer part
     * instead of default one
     */
    integerVariant: TypographyVariants;
    /**
     * Color for integer part
     */
    integerColor: ColorVariants;
    /**
     * Text style preset from Typography for decimal part
     * instead of default one
     */
    decimalVariant: TypographyVariants;
    /**
     * Color for decimal part
     */
    decimalColor: ColorVariants;
};

export type UINumberGeneralProps = {
    /**
     * ID for tests
     */
    testID?: string;
    /**
     * A value to show
     */
    value: number | BigNumber;
    /**
     * How many digits to draw for decimal aspect.
     *
     * You should choose from predefined ones.
     */
    decimalAspect?: UINumberDecimalAspect;
};

export type UINumberProps = UINumberGeneralProps &
    Partial<UINumberAppearance> & {
        /**
         * Whether change of a value should be animated or not.
         */
        animated?: boolean;
    };

export type UICurrencySignProps = {
    /**
     * Text style preset from Typography for sign sign or icon
     * instead of default one.
     *
     * If nothing is provided variant for decimal part will be used.
     */
    signVariant: TypographyVariants;
    /**
     * A char for currency that should be shown after value as a char symbol.
     *
     * If char was provided then icon wouldn't be drawn!
     */
    signChar?: string;
    /**
     * An image source for icon, that act as a currency symbol
     *
     * If char was provided then icon wouldn't be drawn!
     */
    signIcon?: UIImageProps['source'];
    /**
     * Ratio of an icon to help determine width of the icon.
     * Default value is 1.
     *
     * It would try to calculate height of the icon based on
     * `lineHeight` of the current text variant (decimal one).
     */
    signIconAspectRatio?: number;
    /**
     * Use this prop if you want to indicate to a user that
     * there is some loading in process and a value could change.
     *
     * Loading animation is only applied to icon, `signChar` can't be animated.
     */
    loading?: boolean;
};

export type UICurrencyProps = UINumberProps & Partial<UICurrencySignProps>;
