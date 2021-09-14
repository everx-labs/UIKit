import * as React from 'react';
import { StyleSheet, View, TextInput, Text, I18nManager } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { Typography, TypographyVariants } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function getRandomNum() {
    const num = Math.random();
    const symbols = 10 ** (Math.floor(Math.random() * 10) + 1);

    return Math.floor(num * symbols) / 100;
}

export function UIAnimatedBalance({
    role = TypographyVariants.TitleMedium,
    value,
    maxFractionalDigits = 2,
}: {
    role: TypographyVariants;
    value: number;
    maxFractionalDigits?: number;
}) {
    const valueHolder = useSharedValue(value);

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
    return (
        <View style={I18nManager.isRTL ? styles.rtlContainer : styles.ltrContainer}>
            <AnimatedTextInput
                style={[Typography[role], styles.integer]}
                animatedProps={animatedIntegerProps}
                defaultValue={formatted.value.integer}
                editable={false}
            />
            <Text style={[Typography[role], styles.delimeter]}>{uiLocalized.decimalSeparator}</Text>
            <AnimatedTextInput
                style={[Typography[role], styles.fractional]}
                animatedProps={animatedFractionalProps}
                defaultValue={formatted.value.fractional}
                editable={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    ltrContainer: {
        flexDirection: 'row',
    },
    // On RTL RN will reverse `flex-direction` so to draw
    // it properly we should reverse it again
    // as it is a "text-like" container
    // and text in RTL is shown as usual
    rtlContainer: {
        flexDirection: 'row-reverse',
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
    },
    fractional: {
        // text should be "thiner" here for sure by design
        fontWeight: '400',
        // reset RN styles to have proper vertical alignment
        padding: 0,
        lineHeight: undefined,
    },
});
