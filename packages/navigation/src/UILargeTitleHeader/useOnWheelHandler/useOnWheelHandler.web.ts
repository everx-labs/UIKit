/* eslint-disable no-param-reassign */
import * as React from 'react';
import type Animated from 'react-native-reanimated';

import { getYWithRubberBandEffect } from '../getYWithRubberBandEffect';
import { resetPosition } from '../useResetPosition';

const END_THRESHOLD = 100;

export default function useOnWheelHandler(
    shift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
    yIsNegative: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    rubberBandDistance: number,
) {
    const onWheelEndTimeout = React.useRef<number | null>(null);
    const onWheelEndCbRef = React.useRef<(() => void) | null>(null);

    if (onWheelEndCbRef.current == null) {
        onWheelEndCbRef.current = () => {
            resetPosition(shift, largeTitleHeight);
            onWheelEndTimeout.current = null;
        };
    }

    const onWheel = React.useCallback(
        (event) => {
            const { deltaY } = event.nativeEvent;

            if (onWheelEndTimeout.current != null) {
                clearTimeout(onWheelEndTimeout.current);
            } else if (yIsNegative.value) {
                yWithoutRubberBand.value = shift.value;
            }

            onWheelEndTimeout.current = setTimeout(
                onWheelEndCbRef.current,
                END_THRESHOLD,
            );

            // TODO: copy pasted
            if (yIsNegative.value && deltaY < 0) {
                yWithoutRubberBand.value -= deltaY;
                if (shift.value > 0) {
                    shift.value = getYWithRubberBandEffect(
                        yWithoutRubberBand.value,
                        rubberBandDistance,
                    );
                } else {
                    shift.value -= deltaY;
                }
            }
        },
        [yIsNegative, shift, yWithoutRubberBand, rubberBandDistance],
    );

    return onWheel;
}
