/* eslint-disable no-param-reassign */
import * as React from 'react';
import { I18nManager, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { nanoid } from 'nanoid/non-secure';

import { getWorkletFromParentHandler } from '@tonlabs/uikit.scrolls';
import clamp from 'lodash/clamp';

const END_THRESHOLD = 100;
const ON_WHEEL_MIN_DELTA = 10;

function preventDefaultScroll(scrollNode: HTMLElement | null) {
    scrollNode?.addEventListener('scroll', e => e.preventDefault());
    scrollNode?.addEventListener('mousewheel', e => e.preventDefault());
    scrollNode?.addEventListener('touchmove', e => e.preventDefault());
}

interface HTMLElementExtended extends HTMLElement {
    previousScrollLeft: number | null;
}

function getPreventedScrolNode(nativeID: string) {
    const scrollNode = document.getElementById(nativeID);
    if (scrollNode == null) {
        return null;
    }
    (scrollNode as HTMLElementExtended).previousScrollLeft = null;
    return scrollNode as HTMLElementExtended;
}

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
    const { isRTL } = I18nManager.getConstants();

    let scrollNode = getPreventedScrolNode(nativeID);
    preventDefaultScroll(scrollNode);

    return function onWheelHandler(event: React.WheelEvent) {
        if (scrollNode == null) {
            scrollNode = getPreventedScrolNode(nativeID);
            preventDefaultScroll(scrollNode);
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

        const { scrollWidth, clientWidth, previousScrollLeft, scrollTop } = scrollNode;

        const deltaY = isRTL ? -event.deltaY : event.deltaY;
        const { deltaX } = event;

        const scrollDelta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;

        const minScrollLeft = isRTL ? -(scrollWidth - clientWidth) : 0;
        const maxScrollLeft = isRTL ? 0 : scrollWidth - clientWidth;

        const nextScrollLeft = clamp(
            (previousScrollLeft ?? 0) + scrollDelta,
            minScrollLeft,
            maxScrollLeft,
        );

        scrollNode.previousScrollLeft = nextScrollLeft;
        scrollNode.scrollLeft = nextScrollLeft;
        onWheel(event, {
            x: nextScrollLeft,
            y: scrollTop,
        });
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
