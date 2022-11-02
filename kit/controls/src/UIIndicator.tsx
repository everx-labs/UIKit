import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.themes';
import { addNativeProps } from './addNativeProps';
import { UIConstant } from './constants';

export type UIIndicatorProps = {
    color?: ColorVariants;
    size?: number;
    trackWidth?: number;
    style?: StyleProp<ViewStyle>;
};

/**
 * The maximum length of the visible arc relative to the circumference
 */
// @inline
const MAXIMUM_DASH_LENGTH_COEFFICIENT = 0.8;

export const AnimatedCircle = Animated.createAnimatedComponent(
    addNativeProps(Circle, {
        strokeDashoffset: true,
        /**
         * Used for web
         */
        'stroke-dashoffset': true,
    }),
);

export const UIIndicator = React.memo(function UIIndicator({
    color = ColorVariants.BackgroundAccent,
    size = UIConstant.indicator.defaultSize,
    trackWidth = UIConstant.indicator.defaultTrackWidth,
    style,
}: UIIndicatorProps) {
    const theme = useTheme();

    /**
     * Progress changes from 0 to 1 continually repeating
     */
    const progress = useSharedValue<number>(0);

    React.useEffect(() => {
        progress.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), -1);
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${progress.value * 2 * Math.PI}rad`,
                },
            ],
        };
    }, []);

    const circumference = React.useMemo(() => size * Math.PI, [size]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset =
            circumference * (1 - progress.value * 2) * MAXIMUM_DASH_LENGTH_COEFFICIENT;
        return {
            /** Native */
            strokeDashoffset,
            /** Web */
            'stroke-dashoffset': strokeDashoffset,
        };
    }, [circumference]);

    const radius = React.useMemo(() => (size - trackWidth) / 2, [size, trackWidth]);

    const styles = useStyles(size);

    return (
        <Animated.View style={[styles.container, style, animatedStyle]}>
            <Svg width={size} height={size}>
                <AnimatedCircle
                    animatedProps={animatedProps}
                    stroke={theme[color] as string}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeDasharray={`${circumference * MAXIMUM_DASH_LENGTH_COEFFICIENT} ${
                        circumference * MAXIMUM_DASH_LENGTH_COEFFICIENT
                    }`}
                    strokeWidth={trackWidth}
                />
            </Svg>
        </Animated.View>
    );
});

const useStyles = makeStyles((size: number) => ({
    container: {
        width: size,
        aspectRatio: 1,
    },
}));
