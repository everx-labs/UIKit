/* eslint-disable no-param-reassign */
import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import Animated, { withSpring, withDecay } from 'react-native-reanimated';
import type { ScrollableParentScrollHandler } from '@tonlabs/uikit.scrolls';
import type { ScrollHandlerContext } from '../types';
import { runOnUIPlatformSelect } from './runOnUIPlatformSelect';

function normalizedEnd(
    shift: Animated.SharedValue<number>,
    scrollInProgress: Animated.SharedValue<boolean>,
    parentScrollHandler: ScrollableParentScrollHandler,
    parentScrollHandlerActive: boolean,
) {
    return {
        with(movementHandlers: {
            onUpwardDeceleration(
                velocity: number,
                velocityFactor: number,
                ctx: ScrollHandlerContext,
            ): void;
            onToBottomDeceleration(
                velocity: number,
                velocityFactor: number,
                ctx: ScrollHandlerContext,
            ): void;
            onWithoutDeceleration(): void;
        }) {
            return (event: NativeScrollEvent, ctx: ScrollHandlerContext) => {
                'worklet';

                if (event && parentScrollHandlerActive) {
                    if (ctx.yWithoutRubberBand > 0) {
                        parentScrollHandler(event);
                        return;
                    }
                }

                if (event != null && event.velocity != null && ctx != null) {
                    const isUpwardMotion = runOnUIPlatformSelect({
                        android: event.velocity.y > 0,
                        default: event.velocity.y < 0,
                    });
                    /**
                     * First of all handle upward motion
                     * This is when a header possibly could be shown
                     */
                    if (isUpwardMotion) {
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
                            scrollInProgress.value = false;
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
                         * Velocity for iOS is reverted due to incostistensy between
                         * how we calculate the shift and how a platform see it.
                         *
                         * On Android velocity is very low and decay animation ends very fast,
                         * (partly because `withDecay` ends animation when velocity is lesser then 1)
                         * so to prolong it multiply by 5 (I just chose a random number).
                         * (The same thing for iOS but it's put for velocityFactor,
                         * it just felt better there, no specific technical reason).
                         *
                         * Velocity factor is choosen with an eye test:
                         *  - on iOS 500 should be read as 5 * 100, where:
                         *     * 100 is a multiplier of velocity as iOS gives very little
                         *       velocity value, that results to a very fast decoy animation ending;
                         *     * 5 was choosen with eye test, just to make it feel
                         *       like a continuation of the original scroll view movement.
                         */
                        movementHandlers.onUpwardDeceleration(
                            runOnUIPlatformSelect({
                                ios: -1 * event.velocity.y,
                                android: event.velocity.y * 5,
                                default: event.velocity.y,
                            }),
                            runOnUIPlatformSelect({
                                ios: 500,
                                default: 100,
                            }),
                            ctx,
                        );

                        return;
                    }
                    /**
                     * Just fun story about scrolling on Android:
                     * When you scrolling with your finger imagine the moment
                     * when you release it, you actually can be surprised, but
                     * actually there could be a backward movement that your pad
                     * of a finger can produce, when it released, so at the end
                     * you can get slight velocity in backward direction.
                     * In oreder to reduce it treat such values as the ones
                     * without inertia.
                     * We achive this by accepting velocity values only more than 0.6.
                     */
                    const isToBottomMotion = runOnUIPlatformSelect({
                        android: event.velocity.y < -0.6,
                        default: event.velocity.y > 0,
                    });
                    if (isToBottomMotion) {
                        // Nothing to do, regular scroll
                        if (event.contentOffset.y > 0) {
                            return;
                        }

                        movementHandlers.onToBottomDeceleration(
                            -1 * ctx.lastApproximateVelocity,
                            runOnUIPlatformSelect({
                                android: 70,
                                default: 50,
                            }),
                            ctx,
                        );
                        return;
                    }
                }
                movementHandlers.onWithoutDeceleration();
            };
        },
    };
}

export function useOnEndDrag(
    shift: Animated.SharedValue<number>,
    scrollInProgress: Animated.SharedValue<boolean>,
    largeTitleHeight: Animated.SharedValue<number>,
    defaultShift: Animated.SharedValue<number>,
    mightApplyShiftToScrollView: Animated.SharedValue<boolean>,
    parentScrollHandler: ScrollableParentScrollHandler,
    parentScrollHandlerActive: boolean,
) {
    const onEndHandlerRef = React.useRef<
        ((event: NativeScrollEvent, ctx: ScrollHandlerContext) => void) | null
    >(null);

    if (onEndHandlerRef.current == null) {
        onEndHandlerRef.current = normalizedEnd(
            shift,
            scrollInProgress,
            parentScrollHandler,
            parentScrollHandlerActive,
        ).with({
            /**
             * If we got to that point, that means
             * we should do all the rest job ourselves.
             *
             * At first we try to prolong movement with a decay animation.
             * Decay animation doesn't have the exact point where it stops,
             * we can just specify `clamp` options to prevent over-extenstion cases.
             * (In that cases we should apply rubber band effect, easier to just clamp it).
             * When it's stopped just adjust it to default shift position.
             */
            onUpwardDeceleration(velocity, velocityFactor) {
                'worklet';

                shift.value = withDecay(
                    {
                        velocity,
                        velocityFactor,
                        clamp: [0 - largeTitleHeight.value, 0],
                    },
                    isFinished => {
                        if (isFinished) {
                            shift.value = withSpring(defaultShift.value, {
                                velocity: 1,
                                overshootClamping: true,
                            });
                        }
                        scrollInProgress.value = false;
                    },
                );
            },
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
            onToBottomDeceleration(velocity, velocityFactor, ctx) {
                'worklet';

                mightApplyShiftToScrollView.value = true;
                ctx.scrollTouchGuard = false;
                shift.value = withDecay(
                    {
                        velocity,
                        velocityFactor,
                    },
                    () => {
                        mightApplyShiftToScrollView.value = false;
                        ctx.scrollTouchGuard = true;

                        if (shift.value + largeTitleHeight.value > 0) {
                            shift.value = withSpring(0 - largeTitleHeight.value, {
                                velocity: 1,
                                overshootClamping: true,
                            });
                        }
                        scrollInProgress.value = false;
                    },
                );
            },
            /**
             * If we got to the point that means
             * that no initial velocity was applied to a movement.
             * It means that we should just adjust a position
             * to the nearest snap point.
             */
            onWithoutDeceleration() {
                'worklet';

                function onSpringEnd() {
                    'worklet';

                    scrollInProgress.value = false;
                }

                /**
                 * If it's more then 0 then we have over-extension
                 * when a rubber band effect was applied.
                 * Just reset a position.
                 *
                 * It's not a defaultShift, because if there is
                 * a RefreshControll presented, we don't want to hide it.
                 */
                if (shift.value > 0) {
                    shift.value = withSpring(
                        0,
                        {
                            overshootClamping: true,
                        },
                        onSpringEnd,
                    );

                    return;
                }
                /**
                 * If we are somewhere in between of a large title header
                 * trying to find a nearest edge and move there
                 */
                if (shift.value > (defaultShift.value - largeTitleHeight.value) / 2) {
                    shift.value = withSpring(
                        defaultShift.value,
                        {
                            overshootClamping: true,
                        },
                        onSpringEnd,
                    );
                } else {
                    shift.value = withSpring(
                        0 - largeTitleHeight.value,
                        {
                            overshootClamping: true,
                        },
                        onSpringEnd,
                    );
                }
            },
        });
    }

    return onEndHandlerRef.current || undefined;
}
