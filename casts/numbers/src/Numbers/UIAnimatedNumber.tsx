import * as React from 'react';
import { View, Text } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedProps,
    useAnimatedReaction,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import BigNumber from 'bignumber.js';

import { uiLocalized } from '@tonlabs/localization';

import { Typography, AnimateableText } from '@tonlabs/uikit.themes';

import { localizedNumberFormat, UINumberDecimalAspect } from './localizedNumberFormat';
import { useNumberStaticStyles } from './UIStaticNumber';
import type { UINumberAppearance, UINumberGeneralProps } from './types';
import { useTextLikeContainer } from './useTextLikeContainer';
import { DebugGrid } from './DebugGrid';
import { styles } from './styles';
import { getDecimalPartDigitCount } from './getDecimalPartDigitCount';
import { useBaselineDiff } from './useBaselineDiff';

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

    const decimalDigitCount = React.useMemo(() => {
        return getDecimalPartDigitCount(value, decimalAspect);
    }, [decimalAspect, value]);

    const formatted = useSharedValue(
        localizedNumberFormat(
            value,
            decimalAspect,
            decimalDigitCount,
            decimalSeparator,
            integerGroupChar,
            showPositiveSign,
        ),
    );

    const updateRefs = React.useCallback(
        (isFinished?: boolean) => {
            if (isFinished) {
                prevValueHolder.current = valueHolder.current;
                formatted.value = localizedNumberFormat(
                    valueHolder.current,
                    decimalAspect,
                    decimalDigitCount,
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
        [
            progress.value,
            formatted,
            decimalAspect,
            decimalDigitCount,
            decimalSeparator,
            integerGroupChar,
            showPositiveSign,
        ],
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
            (isFinished?: boolean) => {
                runOnJS(updateRefs)(isFinished);
            },
        );
    }, [value, progress, updateRefs, decimalAspect]);

    const applyFormatted = React.useCallback(
        (p: number) => {
            const newValue = prevValueHolder.current.plus(diff.current.multipliedBy(p));
            formatted.value = localizedNumberFormat(
                newValue,
                decimalAspect,
                decimalDigitCount,
                decimalSeparator,
                integerGroupChar,
                showPositiveSign,
            );
        },
        [
            formatted,
            decimalAspect,
            decimalDigitCount,
            decimalSeparator,
            integerGroupChar,
            showPositiveSign,
        ],
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
            // text: formatted.value.integer,
            text: 'Aasdg',
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

    /**
     * A dirty hack to respect default font scale setting of `Text`,
     * as it's a common solution on SO to disable font scaling.
     * Like here - https://stackoverflow.com/questions/41807843/how-to-disable-font-scaling-in-react-native-for-ios-app
     */
    const defaultAllowFontScaling = React.useRef(
        (Text as any).defaultProps?.allowFontScaling ?? true,
    ).current;

    const decimalWithIntegerBaselineDiff = useBaselineDiff(decimalVariant, integerVariant);

    return (
        <View
            testID={testID}
            style={textLikeContainer}
            // TODO: This component contains wrong values after animation
            accessibilityLabel={`${formatted.value.integer}${formatted.value.decimal}`}
        >
            <AnimateableText
                testID="number-integer"
                style={[Typography[integerVariant], integerColorStyle, styles.integer]}
                animatedProps={animatedIntegerProps}
                selectable={false}
                allowFontScaling={defaultAllowFontScaling}
            />
            <AnimateableText
                testID="number-decimal"
                style={[
                    Typography[decimalVariant],
                    decimalColorStyle,
                    styles.decimal,
                    {
                        transform: [
                            {
                                translateY: decimalWithIntegerBaselineDiff,
                            },
                        ],
                    },
                ]}
                animatedProps={animatedDecimalProps}
                selectable={false}
                allowFontScaling={defaultAllowFontScaling}
            />
            {sign}
            {showDebugGrid && <DebugGrid variant={integerVariant} />}
        </View>
    );
}
