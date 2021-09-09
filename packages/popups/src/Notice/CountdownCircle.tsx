import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTheme, ColorVariants, UILabel, TypographyVariants } from '@tonlabs/uikit.hydrogen';
import { addNativeProps } from '@tonlabs/uikit.charts';
import type { CountdownCirlceProps } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(
    addNativeProps(Circle, {
        r: true,
        strokeDashoffset: true,
    }),
);

const circleOffset = 0.5;

const size = 20;
const strokeWidth = 1.2;
const radius = (size - strokeWidth - circleOffset) / 2;
const circumference = radius * 2 * Math.PI;

export const CountdownCirlce = ({
    countdownValue,
    countdownProgress,
    color,
}: CountdownCirlceProps) => {
    const theme = useTheme();
    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: -circumference * countdownProgress.value,
        };
    });

    const [count, setCount] = React.useState<number>(0);
    useAnimatedReaction(
        () => {
            return {
                countdownValue: countdownValue.value,
            };
        },
        state => {
            const currentCount = Math.ceil(state.countdownValue / 1000);
            if (currentCount !== count) {
                runOnJS(setCount)(currentCount);
            }
        },
    );
    return (
        <View>
            <View style={styles.counter}>
                <UILabel
                    role={TypographyVariants.HeadlineLabel}
                    color={color}
                    style={{
                        textAlign: 'center',
                    }}
                >
                    {count}
                </UILabel>
            </View>
            <View
                style={{
                    transform: [
                        {
                            rotateZ: `${-Math.PI / 2}rad`,
                        },
                    ],
                }}
            >
                <Svg width={size} height={size}>
                    <AnimatedCircle
                        animatedProps={animatedProps}
                        stroke={theme[ColorVariants.TextPrimaryInverted] as string}
                        fill="none"
                        cx={size / 2 + circleOffset / 2}
                        cy={size / 2 - circleOffset / 2}
                        r={radius}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeWidth={strokeWidth}
                    />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    counter: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
