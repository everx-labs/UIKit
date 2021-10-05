import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { Typography } from '../Typography';

import { AnimatedTextInput } from './AnimatedTextInput';
import { useNumberValue } from './useNumberValue';
import {
    runOnUILocalizedNumberFormat,
    UINumberDecimalAspect,
} from './runOnUILocalizedNumberFormat';
import { useNumberStaticStyles } from './UIStaticNumber';
import type { UINumberAppearance, UINumberGeneralProps } from './types';
import { useTextLikeContainer } from './useTextLikeContainer';
import { DebugGrid } from './DebugGrid';

Animated.addWhitelistedNativeProps({ text: true });

export function UIAnimatedNumber({
    testID,
    children,
    decimalAspect = UINumberDecimalAspect.None,
    // appearance
    integerVariant,
    integerColor,
    decimalVariant,
    decimalColor,
    sign,
    showDebugGrid,
    showPositiveSign,
}: UINumberGeneralProps & UINumberAppearance & { sign?: React.ReactNode }) {
    const value: number = useNumberValue(children, decimalAspect);
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
    }, [value, valueHolder]);

    const formatted = useDerivedValue(() => {
        return runOnUILocalizedNumberFormat(
            valueHolder.value,
            decimalAspect,
            decimalSeparator,
            integerGroupChar,
            showPositiveSign,
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

    const textLikeContainer = useTextLikeContainer();

    return (
        <View
            style={textLikeContainer}
            testID={testID}
            accessibilityLabel={`${formatted.value.integer}${formatted.value.decimal}`}
        >
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
            {sign}
            {showDebugGrid && <DebugGrid variant={decimalVariant} />}
        </View>
    );
}

const styles = StyleSheet.create({
    integerInput: {
        fontVariant: ['tabular-nums'],
        // reset RN styles to have proper vertical alignment
        padding: 0,
        ...Platform.select({
            web: {},
            default: { lineHeight: undefined },
        }),
    },
    decimalInput: {
        fontVariant: ['tabular-nums'],
        // reset RN styles to have proper vertical alignment
        padding: 0,
        ...Platform.select({ web: {}, default: { lineHeight: undefined } }),
    },
});
