/* eslint-disable no-param-reassign */
import type * as React from 'react';
import Animated, { measure, scrollTo } from 'react-native-reanimated';
import { Platform } from 'react-native';
import type { ScrollView as RNScrollView, NativeScrollEvent } from 'react-native';

import { getYWithRubberBandEffect } from '../../AnimationHelpers/getYWithRubberBandEffect';
import type {
    ScrollableOnScrollHandler,
    ScrollWorkletEventHandler,
} from '../../Scrollable/Context';
import type { ScrollHandlerContext } from '../types';

const isIOS = Platform.OS === 'ios';

// eslint-disable-next-line func-names
export default function (
    scrollRef: React.RefObject<RNScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    largeTitleHeight: Animated.SharedValue<number>,
    yIsNegative: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    shift: Animated.SharedValue<number>,
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    rubberBandDistance: number,
    parentScrollHandler: ScrollableOnScrollHandler,
) {
    return (event: NativeScrollEvent, ctx: ScrollHandlerContext) => {
        'worklet';

        const { y } = event.contentOffset;

        if (largeTitleHeight.value === 0) {
            try {
                largeTitleHeight.value = measure(largeTitleViewRef).height || 0;
            } catch (e) {
                // nothing
            }
        }

        if (shiftChangedForcibly.value) {
            return;
        }

        /**
         * The fix is needed only for iOS
         *
         * On iOS `onScroll` event could fire on mount sometimes,
         * that's likely a bug in RN or iOS itself.
         * To prevent changes when there wasn't onBeginDrag event
         * (so it's likely not an actual scroll) using a guard
         */
        if (isIOS && ctx != null && !ctx.scrollTouchGuard) {
            return;
        }

        yIsNegative.value = y <= 0;

        if (
            parentScrollHandler &&
            'current' in parentScrollHandler &&
            (parentScrollHandler as any).current != null &&
            'worklet' in (parentScrollHandler as any).current
        ) {
            if (
                /**
                 * Bubble the event when yWithoutRubberBand
                 * is going to be bigger then 0 or when it's bigger now.
                 * For example it can happen when one swipes up very fast
                 * and after finger was released with big velocity
                 * event with big shift happen, that gonna make shift bigger 0
                 */
                yWithoutRubberBand.value - y > 0 ||
                yWithoutRubberBand.value > 0
            ) {
                yWithoutRubberBand.value = Math.max(0, yWithoutRubberBand.value - y);

                const parentScrollWorkletEventHandler = (parentScrollHandler as any)
                    .current as ScrollWorkletEventHandler;

                /**
                 * Here we implement our own version of event propagation
                 * as it doesn't have a way to bubble events for scrollables
                 * because we use regular React context, to pass handlers
                 *
                 * So, UILargeTitleHeader provides his own handlers for ScrollableContext,
                 * therefore any parent handlers won't be attached to ScrollView
                 * But we have to bubble event in some situations if it's needed,
                 * for example for UISheet, when it contains UILargeTitleHeader.
                 *
                 * Here we use the fact that useAnimatedScrollHandler uses WorkletEventHandler
                 * https://github.com/software-mansion/react-native-reanimated/blob/0c2f66f9855a26efe24f52ecff927fe847f7a80e/src/reanimated2/WorkletEventHandler.ts#L11
                 * under the hood
                 */
                parentScrollWorkletEventHandler.worklet(event as any);
                return;
            }
        }
        if (y <= 0) {
            // scrollTo reset real y, so we need to count it ourselves
            yWithoutRubberBand.value -= y;
            if (shift.value > 0) {
                shift.value = getYWithRubberBandEffect(
                    yWithoutRubberBand.value,
                    rubberBandDistance,
                );
            } else {
                shift.value -= y;
            }
            scrollTo(scrollRef, 0, 0, false);
            return;
        }
        if (shift.value > 0 - largeTitleHeight.value) {
            // scrollTo reset real y, so we need to count it ourselves
            yWithoutRubberBand.value -= y;
            shift.value = Math.max(shift.value - y, 0 - largeTitleHeight.value);
            scrollTo(scrollRef, 0, 0, false);
        }
    };
}
