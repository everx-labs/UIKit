import * as React from 'react';
import { StyleSheet, View, Text, I18nManager } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    interpolate,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import BigNumber from 'bignumber.js';

import {
    Typography,
    TypographyVariants,
    getFontMesurements,
    ColorVariants,
    UIImage,
    UIImageProps,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { AnimatedTextInput } from './AnimatedTextInput';

Animated.addWhitelistedNativeProps({ text: true });

// @inline
const DECIMAL_ASPECT_NONE = 1;
// @inline
const DECIMAL_ASPECT_PRECISION = 2;
// @inline
const DECIMAL_ASPECT_SHORT = 3;
// @inline
const DECIMAL_ASPECT_SHORT_ELLIPSIZED = 4;

enum DecimalAspect {
    None = DECIMAL_ASPECT_NONE,
    Precision = DECIMAL_ASPECT_PRECISION,
    Short = DECIMAL_ASPECT_SHORT,
    ShortEllipsized = DECIMAL_ASPECT_SHORT_ELLIPSIZED,
}

function getDecimalAspectDigits(aspect: DecimalAspect) {
    'worklet';

    if (aspect === DECIMAL_ASPECT_SHORT_ELLIPSIZED) {
        return 1;
    }
    if (aspect === DECIMAL_ASPECT_SHORT) {
        return 2;
    }
    if (aspect === DECIMAL_ASPECT_PRECISION) {
        return 9;
    }

    return 0;
}

// TODO: move it to uiLocalized!
// @inline
const INTEGER_GROUP_SIZE = 3;

// Appearance customization
type UINumberAppearance = {
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

type UINumberGeneralProps = {
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
    decimalAspect: DecimalAspect;
};

type UINumberProps = UINumberGeneralProps &
    Partial<UINumberAppearance> & {
        /**
         * Whether change of a value should be animated or not.
         */
        animated?: boolean;
        /**
         * How many digits to draw for decimal aspect.
         *
         * You should choose from predefined ones.
         */
        decimalAspect?: DecimalAspect;
    };

function useNumberStaticStyles(integerColor: ColorVariants, decimalColor: ColorVariants) {
    const theme = useTheme();
    const integerColorStyle = React.useMemo(
        () => ({ color: theme[integerColor] }),
        [theme, integerColor],
    );
    const decimalColorStyle = React.useMemo(
        () => ({ color: theme[decimalColor] }),
        [theme, decimalColor],
    );

    return [integerColorStyle, decimalColorStyle];
}

function UIStaticNumber({
    value: rawValue,
    integerVariant,
    integerColor,
    decimalVariant,
    decimalColor,
    decimalAspect,
}: UINumberGeneralProps & UINumberAppearance) {
    const value: number = React.useMemo(
        () =>
            rawValue instanceof BigNumber
                ? bigNumToNumberWithAspect(rawValue, decimalAspect)
                : rawValue,
        [rawValue],
    );
    const { decimal: decimalSeparator, grouping: integerGroupChar } =
        uiLocalized.localeInfo.numbers;

    const formatted = React.useMemo(() => {
        return runOnUILocalizedNumberFormat(
            value,
            decimalAspect,
            decimalSeparator,
            INTEGER_GROUP_SIZE,
            integerGroupChar,
        );
    }, [value, decimalAspect, decimalSeparator]);

    const [integerColorStyle, decimalColorStyle] = useNumberStaticStyles(
        integerColor,
        decimalColor,
    );

    return (
        <Text>
            <Text style={[Typography[integerVariant], integerColorStyle]}>{formatted.integer}</Text>
            <Text style={[Typography[decimalVariant], decimalColorStyle]}>{formatted.decimal}</Text>
        </Text>
    );
}

function bigNumToNumberWithAspect(value: BigNumber, decimalAspect: DecimalAspect) {
    if (decimalAspect === DecimalAspect.None) {
        return value.integerValue().toNumber();
    }

    const decimalDigits = getDecimalAspectDigits(decimalAspect);

    return value
        .multipliedBy(10 ** decimalDigits)
        .integerValue()
        .dividedBy(10 ** decimalDigits)
        .toNumber();
}

/**
 * TODO: move it to uiLocalized to format number generally!
 *
 * @param rawString
 * @param groupSize
 * @param groupSeparator
 * @returns
 */
const groupReversed = (rawString: string, groupSize: number, groupSeparator: string) => {
    'worklet';

    let groupedPart = '';

    let i = rawString.length;
    while (i > 0) {
        if (groupSize < i) {
            for (let j = 0; j < groupSize; j += 1) {
                groupedPart = rawString[i - j - 1] + groupedPart;
            }

            groupedPart = groupSeparator + groupedPart;
            i -= groupSize;
        } else {
            groupedPart = rawString[i - 1] + groupedPart;
            i -= 1;
        }
    }

    return groupedPart;
};

function runOnUILocalizedNumberFormat(
    value: number,
    decimalAspect: DecimalAspect,
    decimalSeparator: string,
    integerGroupSize: number,
    integerGroupChar: string,
) {
    'worklet';

    // TODO: format integer properly!
    const integer = Math.floor(value);
    const integerFormatted = groupReversed(integer.toString(), integerGroupSize, integerGroupChar);

    if (decimalAspect === DECIMAL_ASPECT_NONE) {
        return {
            integer: integerFormatted,
            decimal: '',
        };
    }

    const digits = getDecimalAspectDigits(decimalAspect);

    // TODO: put ellipsis!
    const decimal = Math.floor((value - integer) * 10 ** digits);
    return {
        integer: integerFormatted,
        decimal: `${decimalSeparator}${decimal.toString().padEnd(digits, '0')}`,
    };
}

function UIAnimatedNumber({
    value: rawValue,
    decimalAspect,
    // appearance
    integerVariant,
    integerColor,
    decimalVariant,
    decimalColor,
}: UINumberGeneralProps & UINumberAppearance) {
    const value: number = React.useMemo(
        () =>
            rawValue instanceof BigNumber
                ? bigNumToNumberWithAspect(rawValue, decimalAspect)
                : rawValue,
        [rawValue],
    );
    const valueHolder = useSharedValue(value);
    const { decimal: decimalSeparator, grouping: integerGroupChar } =
        uiLocalized.localeInfo.numbers;

    React.useEffect(() => {
        if (valueHolder.value === value) {
            return;
        }

        valueHolder.value = withTiming(value, {
            duration: 400,
            easing: Easing.inOut(Easing.ease),
        });
    }, [value]);

    const formatted = useDerivedValue(() => {
        return runOnUILocalizedNumberFormat(
            valueHolder.value,
            decimalAspect,
            decimalSeparator,
            INTEGER_GROUP_SIZE,
            integerGroupChar,
        );
    });

    /**
     * Basically we exploit the fact that TextView's text
     * can be updated with `setNativeProps`,
     * in order to not do it manually just delegating it here
     * to reanimated, that will do the same under the hood
     */
    const animatedIntegerProps: any = useAnimatedProps(() => {
        return {
            text: formatted.value.integer,
        };
    });
    const animatedDecimalProps: any = useAnimatedProps(() => {
        return {
            text: formatted.value.decimal,
        };
    });

    const [integerColorStyle, decimalColorStyle] = useNumberStaticStyles(
        integerColor,
        decimalColor,
    );

    return (
        <>
            <AnimatedTextInput
                style={[Typography[integerVariant], integerColorStyle, styles.integerInput]}
                animatedProps={animatedIntegerProps}
                defaultValue={formatted.value.integer}
                underlineColorAndroid="transparent"
                editable={false}
            />
            <AnimatedTextInput
                style={[Typography[decimalVariant], decimalColorStyle, styles.decimalInput]}
                animatedProps={animatedDecimalProps}
                defaultValue={formatted.value.decimal}
                underlineColorAndroid="transparent"
                editable={false}
            />
        </>
    );
}

export function UINumber({
    animated,
    decimalAspect = DecimalAspect.Short,
    integerVariant = TypographyVariants.ParagraphText,
    decimalVariant = TypographyVariants.ParagraphText,
    integerColor = ColorVariants.TextPrimary,
    decimalColor = ColorVariants.TextPrimary,
    ...rest
}: UINumberProps) {
    if (animated) {
        return (
            <UIAnimatedNumber
                decimalAspect={decimalAspect}
                integerVariant={integerVariant}
                integerColor={integerColor}
                decimalVariant={decimalVariant}
                decimalColor={decimalColor}
                {...rest}
            />
        );
    }

    return (
        <UIStaticNumber
            decimalAspect={decimalAspect}
            integerVariant={integerVariant}
            integerColor={integerColor}
            decimalVariant={decimalVariant}
            decimalColor={decimalColor}
            {...rest}
        />
    );
}

type UICurrencySignProps = {
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

type UICurrencyProps = UINumberProps & Partial<UICurrencySignProps>;

function useInlineIconStyle(variant: TypographyVariants, aspectRatio: number) {
    return React.useMemo(() => {
        const { capHeight } = getFontMesurements(variant);

        if (capHeight == null) {
            return {};
        }

        return {
            // If use whole lineHeight it will not be
            // aligned with the baseline
            // There is a temp workaround to make it look better
            height: capHeight,
            width: capHeight * aspectRatio,
        };
    }, []);
}

function StaticCurrencyIcon({
    signVariant,
    signIcon,
    signIconAspectRatio,
}: Required<Omit<UICurrencySignProps, 'signChar' | 'loading'>>) {
    const iconStyle = useInlineIconStyle(signVariant, signIconAspectRatio);
    /*
     * Space letter here is important here, it's not a mistake!
     * It's placed to have a separation from main balance,
     * instead of `marginLeft` as space is more "text friendly"
     * and will layout properly in text
     */
    return (
        <Text style={[Typography[signVariant]]}>
            {'U00A0'}
            <UIImage source={signIcon} resizeMode={'contain'} style={iconStyle} />
        </Text>
    );
}

const AnimatedUIImage = Animated.createAnimatedComponent(UIImage);

// @inline
const LOADING_ANIMATION_STARTING_POINT = 0;
// @inline
const LOADING_ANIMATION_ENDING_POINT = 1;

function AnimatedCurrencyIcon({
    loading,
    signVariant,
    signIcon,
    signIconAspectRatio,
}: Required<Omit<UICurrencySignProps, 'signChar'>>) {
    const loadingProgress = useSharedValue(LOADING_ANIMATION_STARTING_POINT);

    React.useEffect(() => {
        cancelAnimation(loadingProgress);
        loadingProgress.value = LOADING_ANIMATION_STARTING_POINT;
        if (loading) {
            loadingProgress.value = withRepeat(
                withTiming(LOADING_ANIMATION_ENDING_POINT, {
                    duration: 1000,
                }),
                // to run it forever
                // https://docs.swmansion.com/react-native-reanimated/docs/2.3.0-alpha.2/api/withRepeat#numberofreps-number-default-2
                -1,
            );
        }
    }, [loading]);

    const iconStaticStyle = useInlineIconStyle(signVariant, signIconAspectRatio);

    const iconAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateY: `${interpolate(
                        loadingProgress.value,
                        [LOADING_ANIMATION_STARTING_POINT, LOADING_ANIMATION_ENDING_POINT],
                        [0, 360],
                    )}deg`,
                },
            ],
        };
    });
    /*
     * Space letter here is important here, it's not a mistake!
     * It's placed to have a separation from main balance,
     * instead of `marginLeft` as space is more "text friendly"
     * and will layout properly in text
     */
    return (
        <Text style={[Typography[signVariant]]}>
            {'U00A0'}
            <AnimatedUIImage
                source={signIcon}
                resizeMode={'contain'}
                style={[iconStaticStyle, iconAnimatedStyle]}
            />
        </Text>
    );
}

function CurrencySign({
    signChar,
    signVariant,
    loading,
    signIcon,
    signIconAspectRatio = 1,
}: UICurrencySignProps) {
    if (signChar) {
        return <Text style={[Typography[signVariant]]}>{signChar}</Text>;
    }

    if (signIcon == null) {
        return null;
    }

    if (loading == null) {
        return (
            <StaticCurrencyIcon
                signVariant={signVariant}
                signIcon={signIcon}
                signIconAspectRatio={signIconAspectRatio}
            />
        );
    }

    return (
        <AnimatedCurrencyIcon
            loading={loading}
            signVariant={signVariant}
            signIcon={signIcon}
            signIconAspectRatio={signIconAspectRatio}
        />
    );
}

export function UICurrency({
    testID,
    value,
    animated,
    decimalAspect = DecimalAspect.Short,
    integerVariant = TypographyVariants.TitleLarge,
    decimalVariant = TypographyVariants.LightLarge,
    integerColor = ColorVariants.TextPrimary,
    decimalColor = ColorVariants.TextPrimary,
    signChar,
    signVariant,
    signIcon,
    signIconAspectRatio,
    loading,
}: UICurrencyProps) {
    const textLikeContainer = React.useMemo(
        () => (I18nManager.isRTL ? styles.rtlContainer : styles.ltrContainer),
        [I18nManager.isRTL],
    );

    if (animated) {
        return (
            <View style={styles.intrinsicWrapper}>
                <View style={[textLikeContainer, styles.visible]} testID={testID}>
                    <UIAnimatedNumber
                        decimalAspect={decimalAspect}
                        integerVariant={integerVariant}
                        integerColor={integerColor}
                        decimalVariant={decimalVariant}
                        decimalColor={decimalColor}
                        value={value}
                    />
                    <CurrencySign
                        loading={loading}
                        signChar={signChar}
                        signVariant={signVariant || decimalVariant}
                        signIcon={signIcon}
                        signIconAspectRatio={signIconAspectRatio}
                    />
                </View>
            </View>
        );
    }

    return (
        <>
            <UIStaticNumber
                decimalAspect={decimalAspect}
                integerVariant={integerVariant}
                integerColor={integerColor}
                decimalVariant={decimalVariant}
                decimalColor={decimalColor}
                value={value}
            />
            <CurrencySign
                loading={false}
                signChar={signChar}
                signVariant={signVariant || decimalVariant}
                signIcon={signIcon}
                signIconAspectRatio={signIconAspectRatio}
            />
        </>
    );
}

const styles = StyleSheet.create({
    intrinsicWrapper: {
        flexDirection: 'row',
    },
    main: { position: 'relative' },
    visible: { position: 'absolute', top: 0, left: 0 },
    ltrContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    // On RTL RN will reverse `flex-direction` so to draw
    // it properly we should reverse it again
    // as it is a "text-like" container
    // and text in RTL is shown as usual
    rtlContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
    },
    integerInput: {
        fontVariant: ['tabular-nums'],
        // reset RN styles to have proper vertical alignment
        padding: 0,
        lineHeight: undefined,
    },
    decimalInput: {
        fontVariant: ['tabular-nums'],
        // reset RN styles to have proper vertical alignment
        padding: 0,
        lineHeight: undefined,
    },
    hiddenInput: {
        color: 'transparent',
        // reset RN styles to have proper vertical alignment
        padding: 0,
        lineHeight: undefined,
    },
    hiddenText: { lineHeight: undefined },
});
