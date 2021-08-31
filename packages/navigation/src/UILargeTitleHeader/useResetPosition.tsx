/* eslint-disable no-param-reassign */
import * as React from 'react';
import Animated, { withSpring } from 'react-native-reanimated';
import type { ScrollableParentScrollHandler } from '../Scrollable/Context';
import type { ScrollHandlerContext } from './types';

export function resetPosition(
    shift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
    defaultShift: Animated.SharedValue<number>,
) {
    'worklet';

    if (shift.value > 0) {
        shift.value = withSpring(0, {
            overshootClamping: true,
        });
    } else if (shift.value > (0 - largeTitleHeight.value + defaultShift.value) / 2) {
        shift.value = withSpring(defaultShift.value, {
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
    defaultShift: Animated.SharedValue<number>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    parentScrollHandler: ScrollableParentScrollHandler,
    parentScrollHandlerActive: boolean,
) {
    const resetPositionRef = React.useRef<(() => void) | null>(null);

    if (resetPositionRef.current == null) {
        resetPositionRef.current = (event?: any, ctx?: ScrollHandlerContext) => {
            'worklet';

            if (shiftChangedForcibly.value) {
                return;
            }

            if (ctx != null) {
                ctx.scrollTouchGuard = false;
            }

            if (parentScrollHandlerActive) {
                if (yWithoutRubberBand.value > 0) {
                    parentScrollHandler(event);
                    return;
                }
            }

            resetPosition(shift, largeTitleHeight, defaultShift);
        };
    }

    return resetPositionRef.current || undefined;
}
