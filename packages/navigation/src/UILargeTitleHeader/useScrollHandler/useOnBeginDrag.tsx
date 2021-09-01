/* eslint-disable no-param-reassign */
import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import Animated, { cancelAnimation } from 'react-native-reanimated';
import type { ScrollableParentScrollHandler } from '../../Scrollable/Context';
import type { ScrollHandlerContext } from '../types';

export function useOnBeginDrag(
    shift: Animated.SharedValue<number>,
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
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
            shiftChangedForcibly.value = false;
            yWithoutRubberBand.value = shift.value;

            parentScrollHandler(_event);
        };
    }

    return onBeginHandlerRef.current || undefined;
}
