/* eslint-disable no-param-reassign */
import * as React from 'react';
import Animated, { withSpring } from 'react-native-reanimated';

export function resetPosition(
    blockShift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
) {
    'worklet';

    if (blockShift.value > (0 - largeTitleHeight.value) / 2) {
        blockShift.value = withSpring(0, {
            overshootClamping: true,
        });
    } else {
        blockShift.value = withSpring(0 - largeTitleHeight.value, {
            overshootClamping: true,
        });
    }
}

export function useResetPosition(
    blockShift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
) {
    const resetPositionRef = React.useRef<(() => void) | null>(null);

    if (resetPositionRef.current == null) {
        resetPositionRef.current = () => {
            'worklet';

            resetPosition(blockShift, largeTitleHeight);
        };
    }

    return resetPositionRef.current || undefined;
}
