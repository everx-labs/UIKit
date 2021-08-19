/* eslint-disable no-param-reassign */
import * as React from 'react';

import type { NativeScrollEvent } from 'react-native';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler } from 'react-native-reanimated';

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
    shift: Animated.SharedValue<number>,
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    hasScrollShared: Animated.SharedValue<boolean>,
    yIsNegative: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
) {
    return () => {
        'worklet';

        shiftChangedForcibly.value = false;
        if (!hasScrollShared.value) {
            yWithoutRubberBand.value = shift.value;
            return;
        }
        if (yIsNegative.value) {
            yWithoutRubberBand.value = shift.value;
        }
    };
}

function createOnEnd(hasScrollShared: Animated.SharedValue<boolean>, onEndDrag: () => void) {
    return (_event: PanGestureHandlerGestureEvent['nativeEvent'], ctx: ScrollFallbackCtx) => {
        'worklet';

        if (!hasScrollShared.value) {
            onEndDrag();
        }
        ctx.yPrev = 0;
    };
}

export function useScrollFallbackGestureHandler(
    shift: Animated.SharedValue<number>,
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    hasScrollShared: Animated.SharedValue<boolean>,
    yIsNegative: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    onScroll: (event: NativeScrollEvent) => void,
    onEndDrag: () => void,
) {
    const onActiveRef = React.useRef<ReturnType<typeof createOnActive>>();
    const onStartRef = React.useRef<ReturnType<typeof createOnStart>>();
    const onEndRef = React.useRef<ReturnType<typeof createOnEnd>>();

    if (onActiveRef.current == null) {
        onActiveRef.current = createOnActive(hasScrollShared, yIsNegative, onScroll);
    }
    if (onStartRef.current == null) {
        onStartRef.current = createOnStart(
            shift,
            shiftChangedForcibly,
            hasScrollShared,
            yIsNegative,
            yWithoutRubberBand,
        );
    }
    if (onEndRef.current == null) {
        onEndRef.current = createOnEnd(hasScrollShared, onEndDrag);
    }

    return useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ScrollFallbackCtx>({
        onActive: onActiveRef.current,
        onStart: onStartRef.current,
        onEnd: onEndRef.current,
    });
}
