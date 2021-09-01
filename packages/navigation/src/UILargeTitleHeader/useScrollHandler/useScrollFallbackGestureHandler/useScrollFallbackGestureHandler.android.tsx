/* eslint-disable no-param-reassign */
import * as React from 'react';

import type { NativeScrollEvent } from 'react-native';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler } from 'react-native-reanimated';
import {
    getWorkletFromParentHandler,
    ScrollableParentScrollHandler,
} from '../../../Scrollable/Context';

type ScrollFallbackCtx = {
    yPrev: number;
};

function createOnActive(
    hasScrollShared: Animated.SharedValue<boolean>,
    yIsNegative: Animated.SharedValue<boolean>,
    onScroll: (event: NativeScrollEvent) => void,
) {
    return (event: PanGestureHandlerGestureEvent['nativeEvent'], ctx: ScrollFallbackCtx) => {
        'worklet';

        const y = ctx.yPrev - event.translationY;
        ctx.yPrev = event.translationY;

        if (!hasScrollShared.value) {
            // eventName is needed to work properly with useEvent
            // https://github.com/software-mansion/react-native-reanimated/blob/0c2f66f9855a26efe24f52ecff927fe847f7a80e/src/reanimated2/Hooks.ts#L836
            // @ts-ignore
            onScroll({ contentOffset: { y }, eventName: 'onScroll' });
            return;
        }

        if (yIsNegative.value && y < 0) {
            // eventName is needed to work properly with useEvent
            // https://github.com/software-mansion/react-native-reanimated/blob/0c2f66f9855a26efe24f52ecff927fe847f7a80e/src/reanimated2/Hooks.ts#L836
            // @ts-ignore
            onScroll({ contentOffset: { y }, eventName: 'onScroll' });
        }
    };
}

function createOnStart(
    hasScrollShared: Animated.SharedValue<boolean>,
    yIsNegative: Animated.SharedValue<boolean>,
    onStartDrag: (event: NativeScrollEvent) => void,
) {
    return () => {
        'worklet';

        if (!hasScrollShared.value) {
            // @ts-ignore
            onStartDrag({ eventName: 'onScrollBeginDrag' });
            return;
        }
        if (yIsNegative.value) {
            // @ts-ignore
            onStartDrag({ eventName: 'onScrollBeginDrag' });
        }
    };
}

function createOnEnd(
    hasScrollShared: Animated.SharedValue<boolean>,
    onEndDrag: (event: NativeScrollEvent) => void,
) {
    return (event: PanGestureHandlerGestureEvent['nativeEvent'], ctx: ScrollFallbackCtx) => {
        'worklet';

        const y = ctx.yPrev - event.translationY;
        ctx.yPrev = event.translationY;

        if (!hasScrollShared.value) {
            onEndDrag({
                contentOffset: { x: 0, y },
                velocity: { x: event.velocityX, y: event.velocityY },
                // @ts-ignore
                eventName: 'onScrollEndDrag',
            });
        }
        ctx.yPrev = 0;
    };
}

export function useScrollFallbackGestureHandler(
    hasScrollShared: Animated.SharedValue<boolean>,
    yIsNegative: Animated.SharedValue<boolean>,
    scrollHandler: ScrollableParentScrollHandler,
) {
    const onActiveRef = React.useRef<ReturnType<typeof createOnActive>>();
    const onStartRef = React.useRef<ReturnType<typeof createOnStart>>();
    const onEndRef = React.useRef<ReturnType<typeof createOnEnd>>();

    const scrollWorklet = getWorkletFromParentHandler(scrollHandler);

    if (onActiveRef.current == null) {
        onActiveRef.current = createOnActive(hasScrollShared, yIsNegative, scrollWorklet);
    }
    if (onStartRef.current == null) {
        onStartRef.current = createOnStart(hasScrollShared, yIsNegative, scrollWorklet);
    }
    if (onEndRef.current == null) {
        onEndRef.current = createOnEnd(hasScrollShared, scrollWorklet);
    }

    return useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ScrollFallbackCtx>({
        onActive: onActiveRef.current,
        onStart: onStartRef.current,
        onEnd: onEndRef.current,
    });
}
