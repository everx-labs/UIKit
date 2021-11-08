/* eslint-disable no-param-reassign */
import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import Animated, { cancelAnimation } from 'react-native-reanimated';
import type { ScrollableParentScrollHandler } from '@tonlabs/uikit.scrolls';
import type { ScrollHandlerContext } from '../types';

export function useOnBeginDrag(
    shift: Animated.SharedValue<number>,
    scrollInProgress: Animated.SharedValue<boolean>,
    parentScrollHandler: ScrollableParentScrollHandler,
) {
    const onBeginHandlerRef = React.useRef<
        ((event: NativeScrollEvent, ctx: ScrollHandlerContext) => void) | null
    >(null);

    if (onBeginHandlerRef.current == null) {
        onBeginHandlerRef.current = (_event: NativeScrollEvent, ctx: ScrollHandlerContext) => {
            'worklet';

            cancelAnimation(shift);

            ctx.scrollTouchGuard = true;
            ctx.continueResetOnMomentumEnd = false;
            ctx.yWithoutRubberBand = shift.value;
            scrollInProgress.value = true;

            parentScrollHandler(_event);
        };
    }

    return onBeginHandlerRef.current || undefined;
}
