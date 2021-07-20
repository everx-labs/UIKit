/* eslint-disable no-param-reassign */
import * as React from 'react';
import Animated, { withSpring } from 'react-native-reanimated';

export function resetPosition(
    shift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
    defaultShift: number,
) {
    'worklet';

    if (shift.value > 0) {
        shift.value = withSpring(0, {
            overshootClamping: true,
        });
    } else if (shift.value > (0 - largeTitleHeight.value + defaultShift) / 2) {
        shift.value = withSpring(defaultShift, {
            overshootClamping: true,
        });
    } else {
        shift.value = withSpring(0 - largeTitleHeight.value, {
            overshootClamping: true,
        });
    }
}

export function useResetPosition(
    shift: Animated.SharedValue<number>,
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    largeTitleHeight: Animated.SharedValue<number>,
    defaultShift: number,
) {
    const resetPositionRef = React.useRef<(() => void) | null>(null);

    if (resetPositionRef.current == null) {
        resetPositionRef.current = () => {
            'worklet';

            if (shiftChangedForcibly.value) {
                return;
            }

            resetPosition(shift, largeTitleHeight, defaultShift);
        };
    }

    return resetPositionRef.current || undefined;
}
