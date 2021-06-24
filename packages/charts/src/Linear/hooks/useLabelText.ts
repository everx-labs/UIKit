import * as React from 'react';
import Animated from 'react-native-reanimated';
import type { LinearChartControlPoints } from '../../../types';

export const useLabelText = (
    controlPoints: Readonly<
        Animated.SharedValue<LinearChartControlPoints | null>
    >,
) => {
    const maximum = Animated.useDerivedValue<number | null>(() => {
        if (controlPoints.value === null) {
            return null;
        }
        return controlPoints.value.maximum.value;
    });
    const minimum = Animated.useDerivedValue<number | null>(() => {
        if (controlPoints.value === null) {
            return null;
        }
        return controlPoints.value.minimum.value;
    });

    const [minimumValue, setMinimumValue] = React.useState<number | null>(null);
    const [maximumValue, setMaximumValue] = React.useState<number | null>(null);

    Animated.useAnimatedReaction(
        () => {
            return minimum.value;
        },
        (text: number | null) => {
            Animated.runOnJS(setMinimumValue)(text);
        },
    );

    Animated.useAnimatedReaction(
        () => {
            return maximum.value;
        },
        (text: number | null) => {
            Animated.runOnJS(setMaximumValue)(text);
        },
    );

    return {
        minimumValue,
        maximumValue,
    };
};
