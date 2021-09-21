import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { UILabel, TypographyVariants, useTheme } from '@tonlabs/uikit.themes';
import { addNativeProps } from '@tonlabs/uikit.charts';
import type { CountdownCirlceProps } from './types';
import { UIConstant } from '../constants';

const AnimatedCircle = Animated.createAnimatedComponent(
    addNativeProps(Circle, {
        strokeDashoffset: true,
        /**
         * Used for web
         */
        'stroke-dashoffset': true,
    }),
);

/**
 * It is used so that the stroke is not cut off along the edges of square area on Android
 */
const circleOffset = Platform.OS === 'android' ? 0.5 : 0;

const radius =
    (UIConstant.notice.countdownCircle.size -
        UIConstant.notice.countdownCircle.strokeWidth -
        circleOffset) /
    2;
const circumference = radius * 2 * Math.PI;

const useCounter = (countdownValue: Animated.SharedValue<number>) => {
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
    return count;
};

export const CountdownCirlce = ({
    countdownValue,
    countdownProgress,
    color,
}: CountdownCirlceProps) => {
    const theme = useTheme();
    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = -circumference * countdownProgress.value;
        return {
            /** Native */
            strokeDashoffset,
            /** Web */
            'stroke-dashoffset': strokeDashoffset,
        };
    });

    const count = useCounter(countdownValue);

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
                <Svg
                    width={UIConstant.notice.countdownCircle.size}
                    height={UIConstant.notice.countdownCircle.size}
                >
                    <AnimatedCircle
                        animatedProps={animatedProps}
                        stroke={theme[color] as string}
                        fill="none"
                        cx={UIConstant.notice.countdownCircle.size / 2 + circleOffset / 2}
                        cy={UIConstant.notice.countdownCircle.size / 2 - circleOffset / 2}
                        r={radius}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeWidth={UIConstant.notice.countdownCircle.strokeWidth}
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
