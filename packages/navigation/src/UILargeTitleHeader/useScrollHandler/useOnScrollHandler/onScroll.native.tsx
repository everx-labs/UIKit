/* eslint-disable no-param-reassign */
import type * as React from 'react';
import Animated, { measure, scrollTo } from 'react-native-reanimated';
import { Platform } from 'react-native';
import type { ScrollView as RNScrollView, NativeScrollEvent } from 'react-native';

import { getYWithRubberBandEffect } from '../../../AnimationHelpers/getYWithRubberBandEffect';
import type { ScrollableParentScrollHandler } from '../../../Scrollable/Context';
import type { ScrollHandlerContext } from '../../types';

const isIOS = Platform.OS === 'ios';

// eslint-disable-next-line func-names
export default function (
    scrollRef: React.RefObject<RNScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    largeTitleHeight: Animated.SharedValue<number>,
    yIsNegative: Animated.SharedValue<boolean>,
    shift: Animated.SharedValue<number>,
    rubberBandDistance: number,
    parentScrollHandler: ScrollableParentScrollHandler,
    parentScrollHandlerActive: boolean,
) {
    return (event: NativeScrollEvent, ctx: ScrollHandlerContext) => {
        'worklet';

        const { y } = event.contentOffset;

        // On Android when a content is less than scrollable area
        // onScroll event can return NaN y, that we can't process.
        if (Number.isNaN(y)) {
            return;
        }

        // The `measure` function crashes iOS app in `onScroll` event
        // if (largeTitleHeight.value === 0) {
        //     try {
        //         largeTitleHeight.value = measure(largeTitleViewRef).height || 0;
        //     } catch (e) {
        //         // nothing
        //     }
        // }

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

        if (parentScrollHandlerActive) {
            if (
                /**
                 * Bubble the event when `yWithoutRubberBand`
                 * is going to be bigger then 0 or when it's bigger now.
                 * For example it can happen when one swipes up very fast
                 * and after finger was released with big velocity
                 * event with big shift happen, that gonna make shift bigger 0
                 */
                ctx.yWithoutRubberBand - y > 0 ||
                ctx.yWithoutRubberBand > 0
            ) {
                ctx.yWithoutRubberBand = Math.max(0, ctx.yWithoutRubberBand - y);

                parentScrollHandler(event);
                return;
            }
        }
        if (y !== 0) {
            if (ctx != null) {
                ctx.lastApproximateVelocity = y;
            }
        } else {
            /**
             * Basically there is nothing to do, and we could
             * omit the check, BUT sometimes after `onEnd` the scroll event
             * can be fired with 0 and when it's set to `shift`
             * it can stop current animation
             * (i.e. there is a decay animation in progress)
             * I catched it on Android
             */
            return;
        }
        if (y <= 0) {
            // scrollTo reset real y, so we need to count it ourselves
            ctx.yWithoutRubberBand -= y;
            if (shift.value > 0) {
                shift.value = getYWithRubberBandEffect(ctx.yWithoutRubberBand, rubberBandDistance);
            } else {
                shift.value -= y;
            }
            scrollTo(scrollRef, 0, 0, false);
            return;
        }
        if (shift.value > 0 - largeTitleHeight.value) {
            // scrollTo reset real y, so we need to count it ourselves
            ctx.yWithoutRubberBand -= y;
            shift.value = Math.max(shift.value - y, 0 - largeTitleHeight.value);
            scrollTo(scrollRef, 0, 0, false);
        }
    };
}
