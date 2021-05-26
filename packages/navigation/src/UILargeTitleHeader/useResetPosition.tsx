/* eslint-disable no-param-reassign */
import * as React from 'react';
import Animated, { withSpring } from 'react-native-reanimated';

export function resetPosition(
    shift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
) {
    'worklet';

    if (shift.value > (0 - largeTitleHeight.value) / 2) {
        shift.value = withSpring(0, {
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
    largeTitleHeight: Animated.SharedValue<number>,
) {
    const resetPositionRef = React.useRef<(() => void) | null>(null);

    if (resetPositionRef.current == null) {
        resetPositionRef.current = () => {
            'worklet';

            resetPosition(shift, largeTitleHeight);
        };
    }

    return resetPositionRef.current || undefined;
}
