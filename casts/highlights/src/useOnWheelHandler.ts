/* eslint-disable no-param-reassign */
import * as React from 'react';
import { nanoid } from 'nanoid/non-secure';

import { getWorkletFromParentHandler } from '@tonlabs/uikit.scrolls';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const END_THRESHOLD = 100;
const ON_WHEEL_MIN_DELTA = 10;

/**
 * if one day we want to deal with macos inertia problem,
 * here are few useful links:
 * https://github.com/jquery/jquery-mousewheel/issues/36#issuecomment-67648897
 * https://github.com/hellopath/wheel-inertia/blob/master/index.js
 * https://github.com/d4nyll/lethargy/blob/master/lethargy.coffee
 * https://stackoverflow.com/questions/4339196/how-to-detect-disable-inertial-scrolling-in-mac-safari
 */

function wrapVerticalToHorizontalWheelMovementHandler(
    nativeID: string,
    onWheel: (event: React.WheelEvent, contentOffset: { x: number; y: number }) => void,
) {
    return function onWheelHandler(event: React.WheelEvent) {
        const scrollNode = document.getElementById(nativeID);

        if (scrollNode == null) {
            return;
        }
        if (event.target == null) {
            return;
        }
        // @ts-ignore
        if (!scrollNode.contains(event.target)) {
            return;
        }

        // We handle the event ourselves,
        // don't propagate to an outter scroll view if any
        event.stopPropagation();

        const deltaCoord = event.deltaY || event.deltaX;
        // Note: e.deltaY is not present for `DOMMouseScroll` event (used by Firefox)
        const factor = deltaCoord ? 1 : 100; // the factor value is chosen heuristically
        const delta = deltaCoord || event.detail; // NB e.detail is used for DOMMouseScroll
        const x = scrollNode.scrollLeft + delta * factor;
        const newScrollXValue = Math.min(
            Math.max(0, x),
            scrollNode.scrollWidth - scrollNode.clientWidth,
        );
        scrollNode.scrollLeft = newScrollXValue;

        onWheel(event, { x: scrollNode.scrollLeft, y: scrollNode.scrollTop });
    };
}

function useCreateOnWheelHandler({
    onActive,
    onStart,
    onEnd,
}: {
    onActive: (event: React.WheelEvent, contentOffset: { x: number; y: number }) => void;
    onStart: (event: React.WheelEvent) => void;
    onEnd: (event?: React.WheelEvent) => void;
}) {
    const nativeIDRef = React.useRef(nanoid());
    const onWheelEndTimeout = React.useRef<number>();
    const onWheelEndCbRef = React.useRef<TimerHandler>();

    if (onWheelEndCbRef.current == null) {
        onWheelEndCbRef.current = () => {
            onEnd();
            onWheelEndTimeout.current = undefined;
        };
    }

    const onWheelMapper = React.useCallback(
        (event: React.WheelEvent, contentOffset: { x: number; y: number }) => {
            if (Math.abs(event.deltaX || 0) < ON_WHEEL_MIN_DELTA) {
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

            onActive(event, contentOffset);
        },
        [onStart, onActive],
    );

    const onWheel = React.useMemo(
        () => wrapVerticalToHorizontalWheelMovementHandler(nativeIDRef.current, onWheelMapper),
        [onWheelMapper],
    );

    return {
        nativeID: nativeIDRef.current,
        onWheel,
    };
}

export function useOnWheelHandler(
    scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => any,
) {
    const scrollWorklet = getWorkletFromParentHandler(scrollHandler);
    return useCreateOnWheelHandler({
        onActive: React.useCallback(
            (_event, contentOffset) => {
                scrollWorklet({
                    contentOffset,
                    eventName: 'onScroll',
                });
            },
            [scrollWorklet],
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
