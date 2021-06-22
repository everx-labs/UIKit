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

    const maximumText = Animated.useDerivedValue(() => {
        return maximum.value ? maximum.value.toFixed(2) : '';
    }, []);
    const minimumText = Animated.useDerivedValue(() => {
        return minimum.value ? minimum.value.toFixed(2) : 'Empty';
    }, []);

    const [minimumValue, setMinimumValue] = React.useState<string>('');
    const [maximumValue, setMaximumValue] = React.useState<string>('');

    Animated.useAnimatedReaction(
        () => {
            return minimumText.value;
        },
        (text: string) => {
            Animated.runOnJS(setMinimumValue)(text);
        },
    );

    Animated.useAnimatedReaction(
        () => {
            return maximumText.value;
        },
        (text: string) => {
            Animated.runOnJS(setMaximumValue)(text);
        },
    );

    return {
        minimumValue,
        maximumValue,
    };
};
