/* eslint-disable no-param-reassign */
import * as React from 'react';
import type Animated from 'react-native-reanimated';
import { getWorkletFromParentHandler, ScrollableParentScrollHandler } from '@tonlabs/uikit.scrolls';

const END_THRESHOLD = 100;
const ON_WHEEL_MIN_DELTA = 10;

function useCreateOnWheelHandler({
    onActive,
    onStart,
    onEnd,
}: {
    onActive: (event: React.WheelEvent) => void;
    onStart: (event: React.WheelEvent) => void;
    onEnd: (event?: React.WheelEvent) => void;
}) {
    const onWheelEndTimeout = React.useRef<number>();
    const onWheelEndCbRef = React.useRef<TimerHandler>();

    if (onWheelEndCbRef.current == null) {
        onWheelEndCbRef.current = () => {
            onEnd();
            onWheelEndTimeout.current = undefined;
        };
    }

    const onWheel = React.useCallback(
        (event: React.WheelEvent) => {
            if (Math.abs(event.deltaY || 0) < ON_WHEEL_MIN_DELTA) {
                return;
            }

            if (onWheelEndTimeout.current != null) {
                clearTimeout(onWheelEndTimeout.current);
            } else {
                onStart(event);
            }

            if (onWheelEndCbRef.current != null) {
                onWheelEndTimeout.current = setTimeout(onWheelEndCbRef.current, END_THRESHOLD);
            }

            onActive(event);
        },
        [onStart, onActive],
    );

    return onWheel;
}

export default function useOnWheelHandler(
    yIsNegative: Animated.SharedValue<boolean>,
    hasScrollShared: Animated.SharedValue<boolean>,
    scrollHandler: ScrollableParentScrollHandler,
) {
    const scrollWorklet = getWorkletFromParentHandler(scrollHandler);
    return useCreateOnWheelHandler({
        onActive: React.useCallback(
            event => {
                const { deltaY } = event.nativeEvent;

                if (!hasScrollShared.value) {
                    scrollWorklet({ contentOffset: { y: deltaY }, eventName: 'onScroll' });
                    return;
                }

                if (yIsNegative.value && deltaY < 0) {
                    scrollWorklet({ contentOffset: { y: deltaY }, eventName: 'onScroll' });
                }
            },
            [hasScrollShared, yIsNegative, scrollWorklet],
        ),
        onStart: React.useCallback(() => {
            scrollWorklet({
                eventName: 'onScrollBeginDrag',
            });
        }, [scrollWorklet]),
        onEnd: React.useCallback(() => {
            scrollWorklet({
                eventName: 'onScrollEndDrag',
            });
        }, [scrollWorklet]),
    });
}
