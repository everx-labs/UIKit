/* eslint-disable no-param-reassign */
import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import Animated, { withSpring, withDecay } from 'react-native-reanimated';
import type { ScrollHandlerContext } from '../types';
import { runOnUIPlatformSelect } from './runOnUIPlatformSelect';

function withNormalizedMomentumEnd(
    scrollInProgress: Animated.SharedValue<boolean>,
    cb: (velocity: number, velocityFactor: number) => void,
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
                scrollInProgress.value = false;
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
             */

            /**
             * on Android the event is called 3 times,
             * to prevent applying a decay animation 3 times
             * put a threshold guard here
             */
            const now = Date.now();
            if (ctx.lastMomentumTimestamp && now - ctx.lastMomentumTimestamp < 200) {
                return;
            }
            ctx.lastMomentumTimestamp = now;

            /**
             * Velocity factor was choosen with an eye test
             */

            cb(
                ctx.lastApproximateVelocity,
                runOnUIPlatformSelect({
                    default: 10,
                    android: 50,
                }),
            );
        }
    };
}

export function useOnMomentumEnd(
    defaultShift: number,
    shift: Animated.SharedValue<number>,
    scrollInProgress: Animated.SharedValue<boolean>,
    largeTitleHeight: Animated.SharedValue<number>,
) {
    const onMomentumEndRef = React.useRef<
        ((event: NativeScrollEvent, ctx: ScrollHandlerContext) => void) | null
    >(null);

    if (onMomentumEndRef.current == null) {
        onMomentumEndRef.current = withNormalizedMomentumEnd(
            scrollInProgress,
            (velocity, velocityFactor) => {
                'worklet';

                /**
                 * At the point `shift` might be not synced with actual position,
                 * but fortunately we can sync it right now.
                 * We know that `onMomuntumEnd` was fired
                 * when scroll view had reached 0 y coordinate.
                 * Hence the shift should be the size of largeTitleHeader.
                 * Since animation will be fired only on the next frame, to not skip frame
                 * and make it smoother also applying current velocity now.
                 */
                shift.value = -largeTitleHeight.value + velocity;
                shift.value = withDecay(
                    {
                        velocity,
                        velocityFactor,
                        clamp: [0 - largeTitleHeight.value, 0],
                    },
                    isFinished => {
                        if (isFinished) {
                            shift.value = withSpring(defaultShift, {
                                velocity: 1,
                                overshootClamping: true,
                            });
                        }
                        scrollInProgress.value = false;
                    },
                );
            },
        );
    }

    return onMomentumEndRef.current || undefined;
}
