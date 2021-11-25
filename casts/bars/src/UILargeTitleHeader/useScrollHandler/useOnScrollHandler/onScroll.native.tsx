/* eslint-disable no-param-reassign */
import type * as React from 'react';
import Animated, { /* measure, */ scrollTo } from 'react-native-reanimated';
import { Platform } from 'react-native';
import type { ScrollView as RNScrollView, NativeScrollEvent } from 'react-native';

import { getYWithRubberBandEffect } from '@tonlabs/uikit.popups';
import type { ScrollableParentScrollHandler } from '@tonlabs/uikit.scrolls';
import {
    trackVelocity,
    isDragging,
    isFlingReal,
    getStateDescription,
    isFlingEmulated,
} from '../scrollContext';
import type { ScrollHandlerContext } from '../scrollContext';

const isIOS = Platform.OS === 'ios';

/**
 * Ok, so what scenario we can be at the moment?
 * Let's start with the first render and the first touch event that might happen
 * All is stable at the moment and we have all in the initial place
 * That mean, that our starting point should be 0 at the point.
 *
 * From here we have two possible scenarious:
 * 1. up
 * 2. down
 *
 * in both those scenarious we will reset scrolling for scroll view,
 * so that mean, that contentOffset.y (`coY`) won't represent actual coords,
 * it's just kinda a difference between events.
 * (TODO: can we guarantee that scrollTo will happen exactly between those events?
 *        what if not?
 *        what should we do then?
 *        can we put a guard somehow?
 *        * hypothesis to check - is it fires an event with `coY` == 0? it will be so easier this way)
 *        * another hypothesis to check, so the thought is that (looks very weak)
 *          when movement continues, the `coY` will increase
 *          until the reset will happen. So when the coord is less than the previous diff
 *          we may distinct it. A lot of problems actually:
 *          - What if one started to pull it very fast
 *            then we might get a `coY` that is bigger than
 *            all the previous diff.
 *          - What if one in between starts to move at the opposite direction?
 *            that would break all the logic. Same with straifing.
 *
 * At the moment we should just apply that diff to our context variable.
 *
 * The to the bottom movement is actually pretty easy to handle,
 * just apply diff and calculate the rubber band effect.
 *
 * The upward movement is a bit more interesting
 * as there we should apply `scrollTo` only until
 * (currentCoord - coY) > -1 * headerHeight
 * (TODO: we actually might distinct when coord become bigger than headerHeight
 *        and apply scrollTo with proper offset (do we really need this?))
 *
 * The rest is not that interesting, as it's just a usual scroll.
 * (TODO: should we track our coord here, just not to lose anything,
 *        or it's better to do less work there?)
 */

function getNextPosition(event: NativeScrollEvent, currentPosition: number, headerHeight: number) {
    'worklet';

    const { y } = event.contentOffset;

    // regular scroll
    if (y > 0 && currentPosition + headerHeight <= 0) {
        // TODO: should we keep it sync. Maybe good to not lose anything. Debatable though.

        // Just trying to save every ms here
        // as events could be fired very fast
        // need to do as little as possible
        // (it doesn't save much, but anyway)
        // https://jsbench.me/8ikwaptgyt/1
        // eslint-disable-next-line no-bitwise
        return -1 * (y + headerHeight);
    }
    // to bottom, rubber band effect
    // TODO: see above about determenism of scrollTo
    if (currentPosition >= 0) {
        return currentPosition - y;
    }
    // upward, collapsing
    // TODO: see above about determenism of scrollTo
    return currentPosition - y;
}

function foo(event: NativeScrollEvent) {
    const currentPosition = 0;
    const headerHeight = 0;

    return 1;
}

function test() {
    function assert(income: any, expected: any) {
        if (income === expected) {
            console.log('correct!');
        } else {
            console.log('incorrect!');
        }
    }

    // regular scroll
    assert(getNextPosition({ contentOffset: { y: 5 } } as any, -50, 50), -55);
    // rubber band
    assert(getNextPosition({ contentOffset: { y: -5 } } as any, 10, 50), 15);
    assert(getNextPosition({ contentOffset: { y: 5 } } as any, 10, 50), 5);
    // collapsible area
    assert(getNextPosition({ contentOffset: { y: -5 } } as any, -10, 50), -5);
    assert(getNextPosition({ contentOffset: { y: 5 } } as any, -10, 50), -15);
}

export default function createOnScroll(
    scrollRef: React.RefObject<RNScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    largeTitleHeight: Animated.SharedValue<number>,
    currentPosition: Animated.SharedValue<number>,
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

        /**
         * TODO: rephrase it
         *
         * The fix is needed only for iOS
         *
         * On iOS `onScroll` event could fire on mount sometimes,
         * that's likely a bug in RN or iOS itself.
         * To prevent changes when there wasn't onBeginDrag event
         * (so it's likely not an actual scroll) using a guard
         */
        // if (!(isDragging(ctx) || isFlingReal(ctx))) {
        //     console.log('weird onScroll', getStateDescription(ctx));
        //     return;
        // }

        if (largeTitleHeight.value === 0) {
            try {
                // Comment the next line as `try - catch` can't handle errors from another `worklet`:
                // largeTitleHeight.value = measure(largeTitleViewRef).height || 0;

                // That's why let's run it by our own as per `measure` implementation in Reanimated:
                // https://github.com/software-mansion/react-native-reanimated/blob/1d698d83c6f041603d548bf10d47eab992e50840/src/reanimated2/NativeMethods.ts#L20
                // @ts-ignore
                largeTitleHeight.value = _measure(largeTitleViewRef()).height || 0;
            } catch (e) {
                // nothing
            }
        }

        if (y === 0) {
            // TODO: this is very important!
            console.log('skipped');
            return;
        }

        if (ctx.skipOnNextScroll) {
            // scrollTo(scrollRef, 0, 0, false);
            console.log('skipped****');
            ctx.skipOnNextScroll = false;
            return;
        }

        const nextPosition = getNextPosition(event, currentPosition.value, largeTitleHeight.value);
        const diff = nextPosition - currentPosition.value;

        // console.log(currentPosition.value, nextPosition, diff, y);

        const collapsedEdge = -largeTitleHeight.value;

        // regular scroll
        if (currentPosition.value < collapsedEdge && nextPosition < collapsedEdge) {
            if (isFlingEmulated(ctx)) {
                return;
            }
            currentPosition.value = nextPosition;
            trackVelocity(diff, ctx as any);
            return;
        }

        /**
         * (savelichalex):
         * I don't quite understand what is going on
         * with Android at this point but the thing is
         * that `scrollTo` is actually isn't required for Android here.
         * Somehow it manages to adjust scroll position itself
         * taking `tranlateY` into account.
         * BUT even though it works fine, the scroll view
         * is jigerring during scroll.
         *
         * It looks better with `scrollTo`, but it also has some caveats:
         * - header translate looks not that smooth (OK, but not great)
         * - we get wrong `contentOffset.y` with event:
         *   I guess it's because of the same thing that I described above.
         *   Android tries to compensate transform, and therefore scroll
         *   happen with different velocity than regular one.
         *   Applying the hypothesis above I decided to just double the diff,
         *   and it seems that it does the trick.
         *
         * Stick to the solution with `scrollTo` for now.
         */
        if (diff < 0) {
            /**
             * 1 here is to trick OverScrollView
             * the algorithm is the following:
             * https://github.com/Mixiaoxiao/OverScroll-Everywhere/blob/master/OverScroll/src/com/mixiaoxiao/overscroll/OverScrollDelegate.java#L360-L368
             *
             * Basically it tries to understand, is there a room to scroll up and down
             * so if we set y to 0 the lib would think that it needs to apply
             * overscroll animation, but in reality we don't want it here
             */
            // Compensate 1 described above
            // currentPosition.value = nextPosition + diff + 1;
            // ctx.skipOnNextScroll = true;
            // scrollTo(scrollRef, 0, -diff, false);
            currentPosition.value = nextPosition;

            trackVelocity(diff, ctx as any);
            return;
        }
        currentPosition.value = nextPosition + diff;
        // currentPosition.value = nextPosition;
        // scrollTo(scrollRef, 0, 0, false);
        trackVelocity(diff, ctx as any);
    };
}

/**
 * ---------------------------
 *        |         |         |
 *        |         |  -----  |  -----
 * -----  |  -----  |         |
 *        |         |  -----  |
 *        |  -----  |         |  -----
 * -----  |         |         |
 *
 *
 *        |         |
 *        |         |  -----  |
 * -----  |  -----  |         |
 *        |         |         |
 *        |  -----  |  -----  |
 * -----  |         |         |
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * -----------------------------
 */

// eslint-disable-next-line func-names
function _old(
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

        if (largeTitleHeight.value === 0) {
            try {
                // Comment the next line as `try - catch` can't handle errors from another `worklet`:
                // largeTitleHeight.value = measure(largeTitleViewRef).height || 0;

                // That's why let's run it by our own as per `measure` implementation in Reanimated:
                // https://github.com/software-mansion/react-native-reanimated/blob/1d698d83c6f041603d548bf10d47eab992e50840/src/reanimated2/NativeMethods.ts#L20
                // @ts-ignore
                largeTitleHeight.value = _measure(largeTitleViewRef()).height || 0;
            } catch (e) {
                // nothing
            }
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

        // yIsNegative.value = y <= 0;

        // TODO: probably unneeded
        if (ctx.yWithoutRubberBand == null) {
            ctx.yWithoutRubberBand = 0;
        }

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
                ctx.lastApproximateVelocity = y - ctx.lastKnownContentOffsetY;
                ctx.lastKnownContentOffsetY = y;
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

            scrollTo(scrollRef, 0, 1, false);
        }
    };
}
