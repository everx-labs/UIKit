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

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useHasScroll } from '@tonlabs/uikit.scrolls';

import { getYWithRubberBandEffect } from '../../AnimationHelpers/getYWithRubberBandEffect';
import type { OnOpen, OnClose } from './types';

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

export function usePosition(
    height: Animated.SharedValue<number>,
    origin: Animated.SharedValue<number>,
    bottomInset: Animated.SharedValue<number>,
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

    const position = useSharedValue(0);

    const snapPoint = useDerivedValue(() => {
        return origin.value - height.value - bottomInset.value;
    });

    useAnimatedReaction(
        () => {
            return {
                showState: showState.value,
                height: height.value,
                snapPoint: snapPoint.value,
            };
        },
        (currentState, prevState) => {
            // Sometimes we could be caught in a situation
            // when UISheet was asked to be closed (via visible=false)
            // and at the same time a keyboard was opened
            // so to prevent opening this guard is needed
            // (due to the fact that when sheet is open it's in OPENING state)
            if (
                currentState.showState === SHOW_STATE_OPENING &&
                prevState?.snapPoint !== currentState.snapPoint
            ) {
                cancelAnimation(position);
                showState.value = SHOW_STATE_OPEN;

                return;
            }

            if (currentState.height === 0) {
                return;
            }

            if (
                currentState.showState === SHOW_STATE_OPENING &&
                prevState?.height !== currentState.height
            ) {
                cancelAnimation(position);
                showState.value = SHOW_STATE_OPEN;

                return;
            }

            if (currentState.showState === SHOW_STATE_OPEN) {
                if (hasOpenAnimation) {
                    position.value = withSpring(
                        currentState.snapPoint,
                        OpenSpringConfig,
                        isFinished => {
                            if (isFinished && onOpenEndProp) {
                                runOnJS(onOpenEndProp)();
                            }
                        },
                    );
                } else {
                    position.value = currentState.snapPoint;
                    if (onOpenEndProp) {
                        runOnJS(onOpenEndProp)();
                    }
                }

                showState.value = SHOW_STATE_OPENING;

                return;
            }

            if (currentState.showState === SHOW_STATE_CLOSE) {
                if (hasCloseAnimation) {
                    position.value = withSpring(origin.value, CloseSpringConfig, isFinished => {
                        if (isFinished) {
                            if (onCloseEndProp) {
                                runOnJS(onCloseEndProp)();
                            }
                            runOnJS(onCloseModal)();
                        }
                    });
                } else {
                    position.value = origin.value;
                    if (onCloseEndProp) {
                        runOnJS(onCloseEndProp)();
                    }
                    runOnJS(onCloseModal)();
                }

                showState.value = SHOW_STATE_CLOSING;
            }
        },
    );

    const positionWithoutRubberBand = useSharedValue(0);

    const onTapGestureHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
        onActive: () => {
            showState.value = SHOW_STATE_CLOSE;
            if (onCloseProp) {
                runOnJS(onCloseProp)();
            }
        },
    });

    const yIsNegative = useSharedValue<boolean>(true);

    const adjustPosition = (y: number) => {
        'worklet';

        const intermediatePosition = position.value - y;

        if (y > 0 && intermediatePosition < snapPoint.value) {
            positionWithoutRubberBand.value += y;
            position.value =
                snapPoint.value -
                getYWithRubberBandEffect(
                    positionWithoutRubberBand.value,
                    UILayoutConstant.rubberBandEffectDistance,
                );

            return;
        }

        positionWithoutRubberBand.value = Math.max(positionWithoutRubberBand.value + y, 0);
        position.value = intermediatePosition;
    };

    const resetPosition = () => {
        'worklet';

        if (position.value - snapPoint.value > SWIPE_THRESHOLD) {
            showState.value = SHOW_STATE_CLOSE;
            if (onCloseProp) {
                runOnJS(onCloseProp)();
            }
            return;
        }
        showState.value = SHOW_STATE_OPEN;
    };

    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            const { y } = event.contentOffset;

            yIsNegative.value = y <= 0;

            const intermediatePosition = position.value - y;

            if (y <= 0 || intermediatePosition > snapPoint.value) {
                adjustPosition(y);
                scrollTo(scrollRef, 0, 0, false);
            }
        },
        onBeginDrag: () => {
            positionWithoutRubberBand.value = 0;
        },
        onEndDrag: resetPosition,
        onMomentumEnd: resetPosition,
    });

    const { hasScroll, hasScrollShared, setHasScroll } = useHasScroll();

    const scrollGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        {
            translationY: number;
        }
    >({
        onActive: (event, ctx) => {
            const y = ctx.translationY - event.translationY;
            ctx.translationY = event.translationY;

            const intermediatePosition = position.value - y;

            if (!hasScrollShared.value) {
                if (y <= 0 || intermediatePosition > snapPoint.value) {
                    adjustPosition(y);
                    scrollTo(scrollRef, 0, 0, false);
                    return;
                }
            }

            if (yIsNegative.value && y <= 0) {
                adjustPosition(y);
            }
        },
        onStart: (_event, ctx) => {
            ctx.translationY = 0;
            positionWithoutRubberBand.value = 0;
        },
        onEnd: () => {
            resetPosition();
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

            adjustPosition(y);
        },
        onStart: (_event, ctx) => {
            ctx.translationY = 0;
            positionWithoutRubberBand.value = 0;
        },
        onEnd: () => {
            resetPosition();
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
    };
}
