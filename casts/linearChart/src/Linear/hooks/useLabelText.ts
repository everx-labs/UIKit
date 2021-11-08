import * as React from 'react';
import Animated, { runOnJS, useAnimatedReaction, useDerivedValue } from 'react-native-reanimated';
import type { LinearChartControlPoints } from '../types';

export const useLabelText = (
    controlPoints: Readonly<Animated.SharedValue<LinearChartControlPoints | null>>,
) => {
    const maximum = useDerivedValue<number | null>(() => {
        if (controlPoints.value === null) {
            return null;
        }
        return controlPoints.value.maximum.value;
    });
    const minimum = useDerivedValue<number | null>(() => {
        if (controlPoints.value === null) {
            return null;
        }
        return controlPoints.value.minimum.value;
    });

    const [minimumValue, setMinimumValue] = React.useState<number | null>(null);
    const [maximumValue, setMaximumValue] = React.useState<number | null>(null);

    useAnimatedReaction(
        () => {
            return minimum.value;
        },
        (text: number | null) => {
            runOnJS(setMinimumValue)(text);
        },
    );

    useAnimatedReaction(
        () => {
            return maximum.value;
        },
        (text: number | null) => {
            runOnJS(setMaximumValue)(text);
        },
    );

    return {
        minimumValue,
        maximumValue,
    };
};
