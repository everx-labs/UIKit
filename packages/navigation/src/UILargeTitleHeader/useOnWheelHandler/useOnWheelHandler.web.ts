/* eslint-disable no-param-reassign */
import * as React from 'react';
import type Animated from 'react-native-reanimated';

const END_THRESHOLD = 100;

function useCreateOnWheelHandler({
    onActive,
    onStart,
    onEnd,
}: {
    onActive: (event: React.WheelEvent) => void;
    onStart: () => void;
    onEnd: () => void;
}) {
    const onWheelEndTimeout = React.useRef<number | null>(null);
    const onWheelEndCbRef = React.useRef<(() => void) | null>(null);

    if (onWheelEndCbRef.current == null) {
        onWheelEndCbRef.current = () => {
            onEnd();
            onWheelEndTimeout.current = null;
        };
    }

    const onWheel = React.useCallback(
        (event) => {
            if (onWheelEndTimeout.current != null) {
                clearTimeout(onWheelEndTimeout.current);
            } else {
                onStart();
            }

            onWheelEndTimeout.current = setTimeout(
                onWheelEndCbRef.current,
                END_THRESHOLD,
            );

            onActive(event);
        },
        [onStart, onActive],
    );

    return onWheel;
}

export default function useOnWheelHandler(
    shift: Animated.SharedValue<number>,
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    yIsNegative: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    hasScrollShared: Animated.SharedValue<boolean>,
    onScroll: (event: { contentOffset: { y: number } }) => void,
    onEnd: () => void,
) {
    return useCreateOnWheelHandler({
        onActive: React.useCallback(
            (event: React.WheelEvent) => {
                const { deltaY } = event.nativeEvent;

                if (!hasScrollShared.value) {
                    onScroll({ contentOffset: { y: deltaY } });
                    return;
                }

                if (yIsNegative.value && deltaY < 0) {
                    onScroll({ contentOffset: { y: deltaY } });
                }
            },
            [hasScrollShared, yIsNegative, onScroll],
        ),
        onStart: React.useCallback(() => {
            shiftChangedForcibly.value = false;
            if (yIsNegative.value) {
                yWithoutRubberBand.value = shift.value;
            }
        }, [yIsNegative, yWithoutRubberBand, shift, shiftChangedForcibly]),
        onEnd,
    });
}
