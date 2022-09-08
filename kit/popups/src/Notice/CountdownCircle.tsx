import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { UILabel, TypographyVariants, useTheme } from '@tonlabs/uikit.themes';
import { addNativeProps } from '@tonlabs/uikit.controls';
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

const useCounter = (countdownValue: Animated.SharedValue<number> | undefined) => {
    const [count, setCount] = React.useState<number>(0);
    useAnimatedReaction(
        () => {
            return {
                countdownValue: countdownValue?.value,
            };
        },
        state => {
            const currentCount = state.countdownValue && Math.ceil(state.countdownValue / 1000);
            if (currentCount != null && currentCount !== count) {
                runOnJS(setCount)(currentCount);
            }
        },
    );
    return count;
};

function Counter({
    color,
    countdownValue,
}: Required<Pick<CountdownCirlceProps, 'color' | 'countdownValue'>>) {
    const count = useCounter(countdownValue);
    return (
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
    );
}

export const CountdownCirlce = ({
    countdownValue,
    countdownProgress,
    color,
    size = UIConstant.notice.countdownCircle.size,
    strokeWidth = UIConstant.notice.countdownCircle.strokeWidth,
}: CountdownCirlceProps) => {
    const theme = useTheme();

    const radius = React.useMemo(() => size / 2, [size]);
    const circumference = React.useMemo(() => radius * 2 * Math.PI, [radius]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = -circumference * countdownProgress.value;
        return {
            /** Native */
            strokeDashoffset,
            /** Web */
            'stroke-dashoffset': strokeDashoffset,
        };
    });

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                },
            ]}
        >
            {countdownValue ? <Counter color={color} countdownValue={countdownValue} /> : null}
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
                    width={size + strokeWidth + circleOffset * 2}
                    height={size + strokeWidth + circleOffset * 2}
                >
                    <AnimatedCircle
                        animatedProps={animatedProps}
                        stroke={theme[color] as string}
                        fill="none"
                        cx={radius + strokeWidth / 2 + circleOffset}
                        cy={radius + strokeWidth / 2 + circleOffset}
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
    container: {
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'center',
    },
    counter: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
