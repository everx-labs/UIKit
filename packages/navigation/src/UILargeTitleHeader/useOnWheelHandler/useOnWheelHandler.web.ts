/* eslint-disable no-param-reassign */
import * as React from 'react';
import type Animated from 'react-native-reanimated';

import { getYWithRubberBandEffect } from '../getYWithRubberBandEffect';
import { resetPosition } from '../useResetPosition';

const END_THRESHOLD = 100;

export default function useOnWheelHandler(
    blockShift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
    yOverScroll: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    rubberBandDistance: number,
) {
    const onWheelEndTimeout = React.useRef<number | null>(null);
    const onWheelEndCbRef = React.useRef<(() => void) | null>(null);

    if (onWheelEndCbRef.current == null) {
        onWheelEndCbRef.current = () => {
            resetPosition(blockShift, largeTitleHeight);
            onWheelEndTimeout.current = null;
        };
    }

    const onWheel = React.useCallback(
        (event) => {
            const { deltaY } = event.nativeEvent;

            if (onWheelEndTimeout.current != null) {
                clearTimeout(onWheelEndTimeout.current);
            } else if (yOverScroll.value) {
                yWithoutRubberBand.value = blockShift.value;
            }

            onWheelEndTimeout.current = setTimeout(
                onWheelEndCbRef.current,
                END_THRESHOLD,
            );

            // TODO: copy pasted
            if (yOverScroll.value && deltaY < 0) {
                yWithoutRubberBand.value -= deltaY;
                if (blockShift.value > 0) {
                    blockShift.value = getYWithRubberBandEffect(
                        yWithoutRubberBand.value,
                        rubberBandDistance,
                    );
                } else {
                    blockShift.value -= deltaY;
                }
            }
        },
        [yOverScroll, blockShift, yWithoutRubberBand, rubberBandDistance],
    );

    return onWheel;
}
