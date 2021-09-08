import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useDerivedValue,
    interpolate,
    useAnimatedProps,
    useAnimatedReaction,
    runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTheme, ColorVariants, UILabel, TypographyVariants } from '@tonlabs/uikit.hydrogen';
import type { CountdownCirlceProps } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { PI } = Math;
const size = 20;
const strokeWidth = 2;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

export const CountdownCirlce = ({
    countdownValue,
    countdownProgress,
    color,
}: CountdownCirlceProps) => {
    const theme = useTheme();
    const angle = useDerivedValue(() => {
        return interpolate(countdownProgress.value, [0, 1], [0, PI * 2]);
    });
    const strokeDashoffset = useDerivedValue(() => {
        return angle.value * radius;
    });
    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: strokeDashoffset.value,
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
                <UILabel role={TypographyVariants.HeadlineLabel} color={color}>
                    {count}
                </UILabel>
            </View>
            <Svg width={size} height={size}>
                <AnimatedCircle
                    animatedProps={animatedProps}
                    stroke={theme[ColorVariants.TextPrimaryInverted] as string}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeWidth={strokeWidth}
                />
            </Svg>
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
