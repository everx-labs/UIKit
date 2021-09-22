import * as React from 'react';
import { StyleSheet, View, Text, I18nManager } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    interpolate,
    useAnimatedProps,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

import {
    Typography,
    TypographyVariants,
    ColorVariants,
    UIImage,
    UIImageProps,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { AnimatedTextInput } from './AnimatedTextInput';

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedUIImage = Animated.createAnimatedComponent(UIImage);

// @inline
const LOADING_ANIMATION_STARTING_POINT = 0;
// @inline
const LOADING_ANIMATION_ENDING_POINT = 1;
// @inline
const lineHeightIconAdjustment = 5;

function useIcon(source: UIImageProps['source'], role: TypographyVariants, loading: boolean) {
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

    const iconStaticStyle = React.useMemo(() => {
        const { lineHeight } = StyleSheet.flatten(Typography[role]);
        return {
            // If use whole lineHeight it will not be
            // aligned with the baseline
            // There is a temp workaround to make it look better
            height: lineHeight == null ? undefined : lineHeight - lineHeightIconAdjustment,
        };
    }, []);

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

    return (
        <AnimatedUIImage
            source={source}
            resizeMode={'contain'}
            style={[iconStaticStyle, iconAnimatedStyle]}
        />
    );
}

export function UIAnimatedBalance({
    integerVariant = TypographyVariants.TitleLarge,
    fractionalVariant = TypographyVariants.LightLarge,
    value,
    maxFractionalDigits = 2,
    icon,
    loading = false,
}: {
    value: number;
    icon: UIImageProps['source'];
    integerVariant?: TypographyVariants;
    fractionalVariant?: TypographyVariants;
    // We don't want to deal with edge cases for now
    // as the component is not for use for general cases with all number
    maxFractionalDigits?: 1 | 2 | 3 | 4 | 5;
    loading?: boolean;
}) {
    const theme = useTheme();
    const valueHolder = useSharedValue(value);
    const { decimalSeparator } = uiLocalized;

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
        const integer = Math.floor(valueHolder.value);
        const fractional = Math.floor((valueHolder.value - integer) * 10 ** maxFractionalDigits);
        return {
            integer: integer.toString(),
            fractional: fractional.toString().padEnd(maxFractionalDigits, '0'),
        };
    });

    /**
     * (savelichalex):
     * In order to understand why we need it at all,
     * you should understand that numeric letters
     * actually have different width, so when we change
     * the value of a balance fast, the whole width of it
     * also will have different width, and it will be changing fast.
     * Since icon is positioned after balance, it will cause
     * change of position for icon, that looks like icon is shaking.
     * So to prevent that I drew balance two times:
     * 1. Visible part, that draw actual balance
     * 2. Hidden part, it's a copy of the visible balance with
     *    all numerical letters replaced to "wider" ones
     * Example:
     * 1234.67 -> 5555.55
     *
     * We render icon with hidden part, as it changes width
     * less frequently then visible one, therefore it looks stable.
     * Visible part is just placed above with absolute positioning.
     */
    const normalized = useSharedValue(value.toString());
    useAnimatedReaction(
        () => {
            return formatted.value;
        },
        (state, prevState) => {
            // To change the hidden input only in case the length is changed
            if (
                prevState != null &&
                state.integer.length + state.fractional.length ===
                    prevState.integer.length + prevState.fractional.length
            ) {
                return;
            }

            const numRegExp = /[0-9]/g;
            const wideNumLiteral = '5';

            normalized.value =
                state.integer.replace(numRegExp, wideNumLiteral) +
                decimalSeparator +
                state.fractional.replace(numRegExp, wideNumLiteral);
        },
    );

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
    const animatedFractionalProps: any = useAnimatedProps(() => {
        return {
            text: formatted.value.fractional,
        };
    });

    const normalizedProps: any = useAnimatedProps(() => {
        return {
            text: normalized.value,
        };
    });

    const iconElement = useIcon(icon, integerVariant, loading);

    const colorStyle = React.useMemo(() => ({ color: theme[ColorVariants.TextPrimary] }), [theme]);

    const textLikeContainer = React.useMemo(
        () => (I18nManager.isRTL ? styles.rtlContainer : styles.ltrContainer),
        [I18nManager.isRTL],
    );

    return (
        <View style={styles.intrinsicWrapper}>
            <View style={[textLikeContainer, styles.main]}>
                <AnimatedTextInput
                    style={[Typography[integerVariant], styles.hidden]}
                    animatedProps={normalizedProps}
                    defaultValue={normalized.value}
                    underlineColorAndroid="transparent"
                    editable={false}
                />
                {/*
                 * Space letter here is important here, it's not a mistake!
                 * It's placed to have a separation from main balance,
                 * instead of `marginLeft` as space is more "text friendly"
                 * and will layout properly in text
                 */}
                <Text style={Typography[fractionalVariant]}> {iconElement}</Text>
                <View style={[textLikeContainer, styles.visible]}>
                    <AnimatedTextInput
                        style={[Typography[integerVariant], colorStyle, styles.integer]}
                        animatedProps={animatedIntegerProps}
                        defaultValue={formatted.value.integer}
                        underlineColorAndroid="transparent"
                        editable={false}
                    />
                    <Text style={[Typography[fractionalVariant], colorStyle, styles.delimeter]}>
                        {decimalSeparator}
                    </Text>
                    <AnimatedTextInput
                        style={[Typography[fractionalVariant], colorStyle, styles.fractional]}
                        animatedProps={animatedFractionalProps}
                        defaultValue={formatted.value.fractional}
                        underlineColorAndroid="transparent"
                        editable={false}
                    />
                </View>
            </View>
        </View>
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
    integer: {
        // make it "bold", it's provided by design
        fontWeight: '600',
        // reset RN styles to have proper vertical alignment
        padding: 0,
        lineHeight: undefined,
    },
    delimeter: {
        // text should be "thiner" here for sure by design
        fontWeight: '400',
        lineHeight: undefined,
    },
    fractional: {
        // text should be "thiner" here for sure by design
        fontWeight: '400',
        // reset RN styles to have proper vertical alignment
        padding: 0,
        lineHeight: undefined,
    },
    hidden: {
        color: 'transparent',
    },
});
