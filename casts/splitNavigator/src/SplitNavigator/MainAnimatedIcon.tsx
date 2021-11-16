import * as React from 'react';
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import {
    useColorParts,
    ColorVariants,
    // useTheme,
} from '@tonlabs/uikit.themes';

// @inline
const ANIMATED_ICON_INACTIVE = 0;
// @inline
const ANIMATED_ICON_ACTIVE = 1;
// @inline
const centerDotColorParts = '150,196,228';

type MainAnimatedIconProps = {
    progress: Animated.SharedValue<number>;
    style?: StyleProp<ViewStyle>;
};

export function MainAnimatedIcon({ progress, style }: MainAnimatedIconProps) {
    const { colorParts: bgColorParts } = useColorParts(ColorVariants.BackgroundAccent);
    const { colorParts: borderColorParts } = useColorParts(
        ColorVariants.BackgroundTertiaryInverted,
    );
    const circle1 = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [`rgba(${bgColorParts}, 0)`, `rgba(${bgColorParts}, 1)`],
            ),
            borderColor: interpolateColor(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [`rgba(${borderColorParts}, 1)`, `rgba(${borderColorParts}, 0)`],
            ),
            transform: [
                {
                    scale: interpolate(
                        progress.value,
                        [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                        [0.5, 1],
                    ),
                },
            ],
        };
    });
    const circle2 = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [`rgba(${centerDotColorParts}, 0)`, `rgba(${centerDotColorParts}, 1)`],
            ),
            borderColor: interpolateColor(
                progress.value,
                [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                [`rgba(${borderColorParts}, 1)`, `rgba(${borderColorParts}, 0)`],
            ),
            transform: [
                {
                    scale: interpolate(
                        progress.value,
                        [ANIMATED_ICON_INACTIVE, ANIMATED_ICON_ACTIVE],
                        [1, 0.4],
                    ),
                },
            ],
        };
    });
    return (
        <Animated.View style={[style, { position: 'relative' }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { borderWidth: 4, borderRadius: 50 }, circle1]}
            />
            <Animated.View
                style={[StyleSheet.absoluteFill, { borderWidth: 2, borderRadius: 50 }, circle2]}
            />
        </Animated.View>
    );
}
