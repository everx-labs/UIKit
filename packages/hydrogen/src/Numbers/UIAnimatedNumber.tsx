import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedProps,
    useAnimatedReaction,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import BigNumber from 'bignumber.js';

import { uiLocalized } from '@tonlabs/uikit.localization';

import { Typography } from '../Typography';

import { AnimatedTextInput } from './AnimatedTextInput';
import { localizedNumberFormat, UINumberDecimalAspect } from './localizedNumberFormat';
import { useNumberStaticStyles } from './UIStaticNumber';
import type { UINumberAppearance, UINumberGeneralProps } from './types';
import { useTextLikeContainer } from './useTextLikeContainer';
import { DebugGrid } from './DebugGrid';

Animated.addWhitelistedNativeProps({ text: true });

export function UIAnimatedNumber({
    testID,
    children: value,
    decimalAspect = UINumberDecimalAspect.None,
    // appearance customization
    integerVariant,
    integerColor,
    decimalVariant,
    decimalColor,
    // sign customization
    sign,
    showDebugGrid,
    showPositiveSign,
}: UINumberGeneralProps & UINumberAppearance & { sign?: React.ReactNode }) {
    // Basically we need it only to not re-create `updateRefs`
    const valueHolder = React.useRef(value);
    valueHolder.current = value; // To have it always up to date

    const prevValueHolder = React.useRef(value);
    const diff = React.useRef(new BigNumber(0));

    const progress = useSharedValue(0);
    const { decimal: decimalSeparator, grouping: integerGroupChar } =
        uiLocalized.localeInfo.numbers;

    const formatted = useSharedValue(
        localizedNumberFormat(value, decimalAspect, decimalSeparator, integerGroupChar),
    );

    const updateRefs = React.useCallback(
        (isFinished: boolean) => {
            if (isFinished) {
                prevValueHolder.current = valueHolder.current;
                formatted.value = localizedNumberFormat(
                    valueHolder.current,
                    decimalAspect,
                    decimalSeparator,
                    integerGroupChar,
                    showPositiveSign,
                );
                return;
            }
            prevValueHolder.current = prevValueHolder.current.plus(
                diff.current.multipliedBy(progress.value),
            );
        },
        [progress, decimalAspect, decimalSeparator, integerGroupChar, formatted, showPositiveSign],
    );

    React.useEffect(() => {
        if (prevValueHolder.current.eq(value)) {
            return;
        }

        diff.current = value.minus(prevValueHolder.current);
        progress.value = 0;
        progress.value = withTiming(
            1,
            {
                duration: 400,
                easing: Easing.inOut(Easing.ease),
            },
            (isFinished: boolean) => {
                runOnJS(updateRefs)(isFinished);
            },
        );
    }, [value, progress, updateRefs]);

    const applyFormatted = React.useCallback(
        (p: number) => {
            const newValue = prevValueHolder.current.plus(diff.current.multipliedBy(p));
            formatted.value = localizedNumberFormat(
                newValue,
                decimalAspect,
                decimalSeparator,
                integerGroupChar,
                showPositiveSign,
            );
        },
        [decimalAspect, decimalSeparator, integerGroupChar, formatted, showPositiveSign],
    );

    useAnimatedReaction(
        () => {
            return {
                progress: progress.value,
            };
        },
        state => {
            if (state.progress === 0) {
                return;
            }
            // For some reason it fires after onEnd callback
            // for withTiming, therefore `prevValueHolder` has incorrect
            // value at the point
            if (state.progress === 1) {
                return;
            }

            runOnJS(applyFormatted)(state.progress);
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
        ...Platform.select({ web: {}, default: { lineHeight: undefined } }),
    },
    decimalInput: {
        fontVariant: ['tabular-nums'],
        // reset RN styles to have proper vertical alignment
        padding: 0,
        ...Platform.select({ web: {}, default: { lineHeight: undefined } }),
    },
});
