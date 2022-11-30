import * as React from 'react';
import Animated, { interpolate, interpolateColor, useAnimatedProps } from 'react-native-reanimated';
import { StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useColorParts, ColorVariants, makeRNSvgReanimatedCompat } from '@tonlabs/uikit.themes';
import type { SplitScreenTabBarAnimatedIconComponentProps } from './SplitBottomTabBar';

const AnimatedCircle = Animated.createAnimatedComponent(makeRNSvgReanimatedCompat(Circle));

// @inline
const ANIMATED_ICON_INACTIVE = 0;
// @inline
const ANIMATED_ICON_ACTIVE = 1;
// @inline
const centerDotColorParts = '150,196,228';
// @inline
const STROKE_SIZE = 1.75;

function MainAnimatedIconInner({
    progress,
    s,
}: SplitScreenTabBarAnimatedIconComponentProps & {
    s: ViewStyle & { width: number; height: number };
}) {
    const cx = s.width / 2;
    const cy = cx;
    const bigCircleRadius = cx;
    const bigCircleRadiusWithStroke = bigCircleRadius - STROKE_SIZE / 2;
    const smallCircleRadius = (cx + 1) / 2;
    const smallCircleRadiusWithStroke = smallCircleRadius - STROKE_SIZE / 2;
    const { colorParts: bgColorParts } = useColorParts(ColorVariants.BackgroundAccent);
    const { colorParts: borderColorParts } = useColorParts(ColorVariants.BackgroundTertiary);
    const circle2Props = useAnimatedProps(() => {
        return {
            r: interpolate(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [bigCircleRadiusWithStroke, smallCircleRadiusWithStroke],
            ),
            fill: interpolateColor(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [`rgba(${centerDotColorParts}, 0)`, `rgba(${centerDotColorParts}, 1)`],
            ),
            stroke: interpolateColor(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [`rgba(${borderColorParts}, 1)`, `rgba(${borderColorParts}, 0)`],
            ),
        };
    });
    const circle1Props = useAnimatedProps(() => {
        return {
            r: interpolate(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [smallCircleRadiusWithStroke, bigCircleRadius],
            ),
            fill: interpolateColor(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [`rgba(${bgColorParts}, 0)`, `rgba(${bgColorParts}, 1)`],
            ),
            stroke: interpolateColor(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [`rgba(${borderColorParts}, 1)`, `rgba(${borderColorParts}, 0)`],
            ),
        };
    });
    return (
        <Svg width={s.width} height={s.height}>
            <AnimatedCircle
                animatedProps={circle1Props}
                strokeWidth={STROKE_SIZE}
                cx={cx}
                cy={cy}
            />
            <AnimatedCircle
                animatedProps={circle2Props}
                strokeWidth={STROKE_SIZE}
                cx={cx}
                cy={cy}
            />
        </Svg>
    );
}

export const MainAnimatedIcon = React.memo(function MainAnimatedIcon({
    progress,
    style,
}: SplitScreenTabBarAnimatedIconComponentProps) {
    if (style == null) {
        return null;
    }
    const s = StyleSheet.flatten(style);
    if (
        s.width == null ||
        typeof s.width !== 'number' ||
        s.height == null ||
        typeof s.height !== 'number'
    ) {
        return null;
    }

    return (
        <MainAnimatedIconInner
            progress={progress}
            style={style}
            // @ts-expect-error (we actually have all the necessary checks but TS doesn't understand them)
            s={s}
        />
    );
});
