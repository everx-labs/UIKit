/* eslint-disable no-param-reassign */
import * as React from 'react';
// @ts-expect-error
import SpringConfig from 'react-native/Libraries/Animated/SpringConfig';
import type {
    PanGestureHandlerGestureEvent,
    TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
    cancelAnimation,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useDerivedValue,
    useSharedValue,
    withSpring,
    scrollTo,
} from 'react-native-reanimated';

import { useHasScroll } from '@tonlabs/uikit.scrolls';

import { AnimationHelpers } from '@tonlabs/uikit.layout';
import type { OnOpen, OnClose } from './types';

const { getYWithRubberBandEffect } = AnimationHelpers;

const OpenSpringConfig = {
    overshootClamping: false,
    mass: 1,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    ...SpringConfig.fromBouncinessAndSpeed(5, 12),
};

const CloseSpringConfig = {
    overshootClamping: false,
    mass: 1,
    restSpeedThreshold: 100,
    restDisplacementThreshold: 40,
    ...SpringConfig.fromBouncinessAndSpeed(1, 12),
};

// @inline
const SHOW_STATE_CLOSE = 0;
// @inline
const SHOW_STATE_CLOSING = 1;
// @inline
const SHOW_STATE_OPEN = 2;
// @inline
const SHOW_STATE_OPENING = 3;
// @inline
// const SHOW_STATE_DRAG = 4;

type ShowStates = 0 | 1 | 2 | 3 | 4;

// @inline
const SWIPE_THRESHOLD = 50; // UILayoutConstant.swipeThreshold
// @inline
const RUBBER_BAND_EFFECT_DISTANCE = 50; // UILayoutConstant.rubberBandEffectDistance

function resetPosition(
    normalizedPosition: Animated.SharedValue<number>,
    showState: Animated.SharedValue<number>,
    snapPoint: number,
    onCloseProp: OnClose | undefined,
) {
    'worklet';

    if (normalizedPosition.value - snapPoint > SWIPE_THRESHOLD) {
        showState.value = SHOW_STATE_CLOSE;
        if (onCloseProp) {
            runOnJS(onCloseProp)();
        }
        return;
    }
    showState.value = SHOW_STATE_OPEN;
}

export const SheetReadyContext = React.createContext<Animated.SharedValue<boolean> | null>(null);

export function useSheetReady() {
    const ready = React.useContext(SheetReadyContext);

    if (ready == null) {
        throw new Error('Are you using `useIntrinsicSizeScrollView` not in `UISheet` context?');
    }

    return ready;
}

export function usePosition(
    height: Animated.SharedValue<number>,
    origin: Animated.SharedValue<number>,
    hasOpenAnimation: boolean = true,
    hasCloseAnimation: boolean = true,
    onCloseProp: OnClose | undefined,
    onCloseModal: OnClose,
    onOpenEndProp: OnOpen | undefined,
    onCloseEndProp: OnClose | undefined,
) {
    const showState = useSharedValue<ShowStates>(SHOW_STATE_CLOSING);

    const animate = React.useCallback(
        (isShow: boolean) => {
            if (isShow) {
                showState.value = SHOW_STATE_OPEN;
                return;
            }
            showState.value = SHOW_STATE_CLOSE;
        },
        [showState],
    );

    /**
     * A position from y=0, to not involve origin here,
     * as it can be animated separately
     */
    const normalizedPosition = useSharedValue(0);

    const snapPoint = useDerivedValue(() => {
        return 0 - height.value;
    });

    const { hasScroll, hasScrollShared, setHasScroll } = useHasScroll();

    /**
     * Position starting from origin,
     * that is used in animated `style`
     */
    const position = useDerivedValue(() => {
        if (normalizedPosition.value < snapPoint.value) {
            if (hasScrollShared.value) {
                return origin.value + snapPoint.value;
            }
            return (
                origin.value +
                snapPoint.value -
                getYWithRubberBandEffect(
                    snapPoint.value - normalizedPosition.value,
                    RUBBER_BAND_EFFECT_DISTANCE,
                )
            );
        }

        return origin.value + normalizedPosition.value;
    });

    /**
     * A guard that is used to wait for some calculations
     * that can influence animation.
     * For example see `useIntrinsicSizeScrollView`
     */
    const ready = useSharedValue(true);

    useAnimatedReaction(
        () => {
            return {
                showState: showState.value,
                height: height.value,
                snapPoint: snapPoint.value,
                ready: ready.value,
            };
        },
        (currentState, prevState) => {
            if (!currentState.ready) {
                return;
            }

            if (currentState.snapPoint === 0) {
                return;
            }

            if (
                currentState.showState === SHOW_STATE_OPENING &&
                prevState?.snapPoint !== currentState.snapPoint
            ) {
                cancelAnimation(normalizedPosition);
                normalizedPosition.value = currentState.snapPoint;

                return;
            }

            if (currentState.showState === SHOW_STATE_OPEN) {
                if (hasOpenAnimation) {
                    normalizedPosition.value = withSpring(
                        currentState.snapPoint,
                        OpenSpringConfig,
                        isFinished => {
                            if (isFinished && onOpenEndProp) {
                                runOnJS(onOpenEndProp)();
                            }
                        },
                    );
                } else {
                    normalizedPosition.value = currentState.snapPoint;
                    if (onOpenEndProp) {
                        runOnJS(onOpenEndProp)();
                    }
                }

                showState.value = SHOW_STATE_OPENING;

                return;
            }

            if (currentState.showState === SHOW_STATE_CLOSE) {
                if (hasCloseAnimation) {
                    normalizedPosition.value = withSpring(0, CloseSpringConfig, isFinished => {
                        if (isFinished) {
                            if (onCloseEndProp) {
                                runOnJS(onCloseEndProp)();
                            }
                            runOnJS(onCloseModal)();
                        }
                    });
                } else {
                    normalizedPosition.value = origin.value;
                    if (onCloseEndProp) {
                        runOnJS(onCloseEndProp)();
                    }
                    runOnJS(onCloseModal)();
                }

                showState.value = SHOW_STATE_CLOSING;
            }
        },
    );

    const onTapGestureHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
        onActive: () => {
            showState.value = SHOW_STATE_CLOSE;
            if (onCloseProp) {
                runOnJS(onCloseProp)();
            }
        },
    });

    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const scrollHandler = useAnimatedScrollHandler<{
        translationY: number;
    }>({
        onScroll: (event, ctx) => {
            const y = event.contentOffset.y - ctx.translationY;
            ctx.translationY = event.contentOffset.y;

            normalizedPosition.value -= y;

            if (normalizedPosition.value > snapPoint.value) {
                ctx.translationY = 0;
                /**
                 * Be careful with scrollTo, as while call is executing
                 * there could be run another handler on the thread,
                 * that's why context reset is set BEFORE call
                 */
                scrollTo(scrollRef, 0, 0, false);
            }
        },
        onBeginDrag: (_event, ctx) => {
            ctx.translationY = 0;
        },
        onEndDrag: () => resetPosition(normalizedPosition, showState, snapPoint.value, onCloseProp),
        onMomentumEnd: () =>
            resetPosition(normalizedPosition, showState, snapPoint.value, onCloseProp),
    });

    const scrollGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        {
            translationY: number;
        }
    >({
        onActive: (event, ctx) => {
            const y = ctx.translationY - event.translationY;
            ctx.translationY = event.translationY;

            normalizedPosition.value -= y;

            if (normalizedPosition.value > snapPoint.value) {
                scrollTo(scrollRef, 0, 0, false);
            }
        },
        onStart: (_event, ctx) => {
            ctx.translationY = 0;
        },
        onEnd: () => {
            resetPosition(normalizedPosition, showState, snapPoint.value, onCloseProp);
        },
    });

    const onPanGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        {
            translationY: number;
        }
    >({
        onActive: (event, ctx) => {
            const y = ctx.translationY - event.translationY;
            ctx.translationY = event.translationY;

            normalizedPosition.value -= y;
        },
        onStart: (_event, ctx) => {
            ctx.translationY = 0;
        },
        onEnd: () => {
            resetPosition(normalizedPosition, showState, snapPoint.value, onCloseProp);
        },
    });

    return {
        animate,
        onTapGestureHandler,
        onPanGestureHandler,
        scrollRef,
        scrollHandler,
        scrollGestureHandler,
        hasScroll,
        setHasScroll,
        position,
        ready,
    };
}
