/* eslint-disable no-param-reassign */
import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import Animated, {
    withSpring,
    withDecay,
    useAnimatedReaction,
    scrollTo,
    useSharedValue,
} from 'react-native-reanimated';
import type { ScrollableParentScrollHandler } from '../Scrollable/Context';
import type { ScrollHandlerContext } from './types';

export function onMomentumEndCreate(
    shift: Animated.SharedValue<number>,
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    largeTitleHeight: Animated.SharedValue<number>,
    defaultShift: Animated.SharedValue<number>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    resetPosition: (event: NativeScrollEvent) => void,
) {
    return (event: NativeScrollEvent, ctx: ScrollHandlerContext) => {
        'worklet';

        /**
         * If we got there then there was an end event
         * while scroll view was in motion
         * but didn't reach header title yet.
         */
        if (ctx != null && ctx.continueResetOnMomentumEnd) {
            /**
             * At first we look if it reach the header title.
             * If not then we doesn't have anything to do,
             * ScrollView already did all the necessary work.
             */
            if (event.contentOffset.y > 0) {
                return;
            }
            /**
             * But if it reached the header, then
             * on the last call of `onScroll` it called `scrollTo`
             * that stopped momentum, and inertia was lost.
             * Hence we should do rest of the movement ourselves.
             * With the `scrollTo` call we lost last velocity information,
             * therefore we try to distinguish it, and looks like the distance
             * traveled with the last `onScroll` call is our velocity.
             *
             * As with `onEnd` event, velocity factor was choosen
             * with an eye test:
             *  1) For iOS 10 looks to feel the smooth enough.
             *  2) TODO: Android
             *  3) TODO: Web
             */
            const distance = largeTitleHeight.value + shift.value;
            shift.value = withDecay(
                {
                    velocity: distance,
                    velocityFactor: 10,
                    clamp: [0 - largeTitleHeight.value, 0],
                },
                isFinished => {
                    if (isFinished) {
                        shift.value = withSpring(defaultShift.value, {
                            velocity: 1 / 20,
                            overshootClamping: true,
                        });
                    }
                },
            );
        }
    };
}

export function resetPosition(
    shift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
    defaultShift: Animated.SharedValue<number>,
    mightApplyShiftToScrollView: Animated.SharedValue<boolean>,
    event?: NativeScrollEvent,
    ctx?: ScrollHandlerContext,
) {
    'worklet';

    if (event != null && event.velocity != null && ctx != null) {
        /**
         * First of all handle upward motion
         * This is when a header possibly could be shown
         */
        if (event.velocity.y < 0) {
            /**
             * At first we handle a situation
             * when the end event occurred while large header was "extended"
             * over the limits and when we apply a rubber band effect.
             * Doing it the same way as iOS does - just return it to the nearest position.
             */
            if (shift.value > 0) {
                shift.value = withSpring(0, {
                    overshootClamping: true,
                });
                return;
            }
            /**
             * Next we look if the header became visible.
             * Here we handle when it doesn't.
             * That means that we should wait until `onMomentumEnd` fired
             * as ScrollView will continue to fire regular `onScroll` events until it.
             */
            if (event.contentOffset.y > 0) {
                if (ctx != null) {
                    ctx.continueResetOnMomentumEnd = true;
                }

                return;
            }
            /**
             * If we got to that point, that means
             * we should do all the rest job ourselves.
             *
             * At first we try to prolong movement with a decay animation.
             * Decay animation doesn't have the exact point where it stops,
             * we can just specify `clamp` options to prevent over-extenstion cases.
             * (In that cases we should apply rubber band effect, easier to just clamp it).
             * When it's stopped just adjust it to default shift position.
             *
             * Velocity is reverted due to incostistensy between
             * how we calculate a shift and how a platform see it.
             *
             * Velocity factor is choosen with an eye test:
             *  1) on iOS 500 should be read as 5 * 100, where:
             *     - 100 is a multiplier of velocity as iOS gives very little
             *       velocity value, that results to a very fast decoy animation ending;
             *     - 5 was choosen with eye test, just to make it feel
             *       like a continuation of the original scroll view movement.
             *  2) TODO: Android
             *  3) TODO: Web
             */
            shift.value = withDecay(
                {
                    velocity: -1 * event.velocity.y,
                    velocityFactor: 500,
                    clamp: [0 - largeTitleHeight.value, 0],
                },
                isFinished => {
                    if (isFinished) {
                        shift.value = withSpring(defaultShift.value, {
                            velocity: 1 / 20,
                            overshootClamping: true,
                        });
                    }
                },
            );
            return;
        } else if (event.velocity.y > 0) {
            /**
             * Handling motion to the bottom
             */
            // Nothing to do, regular scroll
            if (event.contentOffset.y > 0) {
                return;
            }
            /**
             * At the point goes the probably hardest case.
             * So here we got to the point when a user expects
             * the motion to continue beyond header,
             * but unfortunately we can't rely
             * on ScrollView events to achieve that,
             * since with the last `onScroll` call we called `scrollTo`
             * that shut down any inertia that
             * might've been initiated internally in native ScrollView.
             * Hence we should do all the work ourselves:
             * At first we have to animate with decay to the bottom edge,
             * but this is OK, then goes the trickiest part -
             * after that point we should stop animating header and
             * start scrolling a scroll view, to emulate usual scrolling.
             */
            mightApplyShiftToScrollView.value = true;
            ctx.scrollTouchGuard = false;
            shift.value = withDecay(
                {
                    velocity: -1 * ctx.lastApproximateVelocity,
                    velocityFactor: 50,
                },
                () => {
                    mightApplyShiftToScrollView.value = false;
                    ctx.scrollTouchGuard = true;

                    if (shift.value + largeTitleHeight.value > 0) {
                        shift.value = withSpring(0 - largeTitleHeight.value, {
                            velocity: 1 / 20,
                            overshootClamping: true,
                        });
                    }
                },
            );
            return;
        }
    }

    /**
     * If we got to the point that means
     * that no initial velocity was applied to a movement.
     * It means that we should just adjust a position
     * to the nearest snap point.
     */
    /**
     * If it's more then 0 then we have over-extension
     * when a rubber band effect was applied.
     * Just reset a position.
     *
     * It's not a defaultShift, because if there is
     * a RefreshControll presented, we don't want to hide it.
     */
    if (shift.value > 0) {
        shift.value = withSpring(0, {
            overshootClamping: true,
        });
        /**
         * If we are somewhere in between of a large title header
         * trying to find a nearest edge and move there
         */
    } else if (shift.value > (0 - largeTitleHeight.value + defaultShift.value) / 2) {
        shift.value = withSpring(defaultShift.value, {
            overshootClamping: true,
        });
    } else {
        shift.value = withSpring(0 - largeTitleHeight.value, {
            overshootClamping: true,
        });
    }
}

export function useResetPosition(
    scrollRef: React.RefObject<Animated.ScrollView>,
    shift: Animated.SharedValue<number>,
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    largeTitleHeight: Animated.SharedValue<number>,
    defaultShift: Animated.SharedValue<number>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    parentScrollHandler: ScrollableParentScrollHandler,
    parentScrollHandlerActive: boolean,
) {
    const resetPositionRef = React.useRef<
        ((event?: NativeScrollEvent, ctx?: ScrollHandlerContext) => void) | null
    >(null);
    const mightApplyShiftToScrollView = useSharedValue(false);

    useAnimatedReaction(
        () => {
            return {
                shift: shift.value,
                largeTitleHeight: largeTitleHeight.value,
                mightApplyShiftToScrollView: mightApplyShiftToScrollView.value,
            };
        },
        state => {
            if (!state.mightApplyShiftToScrollView) {
                return;
            }

            scrollTo(scrollRef, 0, 0 - state.shift - state.largeTitleHeight, false);
        },
    );

    if (resetPositionRef.current == null) {
        resetPositionRef.current = (event?: NativeScrollEvent, ctx?: ScrollHandlerContext) => {
            'worklet';

            if (shiftChangedForcibly.value) {
                return;
            }

            if (event && parentScrollHandlerActive) {
                if (yWithoutRubberBand.value > 0) {
                    parentScrollHandler(event);
                    return;
                }
            }

            resetPosition(
                shift,
                largeTitleHeight,
                defaultShift,
                mightApplyShiftToScrollView,
                event,
                ctx,
            );
        };
    }

    return resetPositionRef.current || undefined;
}
