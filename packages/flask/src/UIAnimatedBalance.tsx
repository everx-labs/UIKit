import * as React from 'react';
import { StyleSheet, View, TextInput, Text, I18nManager } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

import {
    Typography,
    TypographyVariants,
    UIImage,
    UIImageProps,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedUIImage = Animated.createAnimatedComponent(UIImage);

export function getRandomNum() {
    const num = Math.random();
    const symbols = 10 ** (Math.floor(Math.random() * 10) + 1);

    return Math.floor(num * symbols) / 100;
}

export function UIAnimatedBalance({
    role = TypographyVariants.TitleMedium,
    value,
    maxFractionalDigits = 2,
    icon,
}: {
    role: TypographyVariants;
    value: number;
    maxFractionalDigits?: number;
    icon: UIImageProps['source'];
}) {
    const valueHolder = useSharedValue(value);
    const iconProgress = useSharedValue(0);

    React.useEffect(() => {
        if (valueHolder.value === value) {
            return;
        }

        const duration = 500;
        iconProgress.value = 0;
        iconProgress.value = withTiming(1, {
            duration: duration + duration * 0.4,
            // easing: Easing.inOut(Easing.ease),
        });
        valueHolder.value = withDelay(
            0.2 * duration,
            withTiming(value, {
                duration: duration * 0.6,
                easing: Easing.inOut(Easing.ease),
            }),
        );
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

    const iconStyle = useAnimatedStyle(() => {
        return {};
        return {
            transform: [
                {
                    scale: interpolate(iconProgress.value, [0, 0.2, 0.8, 1], [1, 0, 0, 1]),
                },
            ],
        };
        return {
            opacity: interpolate(iconProgress.value, [0, 0.2, 0.8, 1], [1, 0, 0, 1]),
        };
        return {
            transform: [
                {
                    rotateY: `${interpolate(
                        iconProgress.value,
                        [0, 0.2, 0.8, 1],
                        [0, 90, 90, 0],
                    )}deg`,
                },
            ],
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
            <Text style={Typography[role]}>
                {' '}
                <AnimatedUIImage
                    source={icon}
                    tintColor={ColorVariants.IconAccent}
                    resizeMode={'contain'}
                    style={[
                        {
                            height: StyleSheet.flatten(Typography[role]).lineHeight - 5,
                            // backgroundColor: 'rgba(255,0,0,.1)',
                        },
                        iconStyle,
                    ]}
                />
            </Text>
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
