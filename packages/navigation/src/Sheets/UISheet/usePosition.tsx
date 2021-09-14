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

import { UIConstant } from '../../constants';
import { getYWithRubberBandEffect } from '../../AnimationHelpers/getYWithRubberBandEffect';
import { useHasScroll } from '../../Scrollable';
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

// eslint-disable-next-line no-shadow
enum SHOW_STATES {
    CLOSE = 0,
    CLOSING = 1,
    OPEN = 2,
    OPENING = 3,
    DRAG = 4,
}

export function usePosition(
    height: Animated.SharedValue<number>,
    keyboardHeight: Animated.SharedValue<number>,
    hasOpenAnimation: boolean = true,
    hasCloseAnimation: boolean = true,
    shouldHandleKeyboard: boolean = true,
    onCloseProp: OnClose | undefined,
    onCloseModal: OnClose,
    onOpenEndProp: OnOpen | undefined,
    onCloseEndProp: OnClose | undefined,
) {
    const showState = useSharedValue<SHOW_STATES>(SHOW_STATES.CLOSING);

    const animate = React.useCallback(
        (isShow: boolean) => {
            if (isShow) {
                showState.value = SHOW_STATES.OPEN;
                return;
            }
            showState.value = SHOW_STATES.CLOSE;
        },
        [showState],
    );

    const position = useSharedValue(0);

    const snapPointPosition = useDerivedValue(() => {
        let snapPoint = 0 - height.value;
        if (shouldHandleKeyboard) {
            snapPoint - keyboardHeight.value;
        }
        return snapPoint;
    });

    useAnimatedReaction(
        () => {
            return {
                showState: showState.value,
                height: height.value,
                keyboardHeight: keyboardHeight.value,
                snapPointPosition: snapPointPosition.value,
            };
        },
        (currentState, prevState) => {
            // Sometimes we could be caught in a situation
            // when UISheet was asked to be closed (via visible=false)
            // and at the same time a keyboard was opened
            // so to prevent opening this guard is needed
            // (due to the fact that when sheet is open it's in OPENING state)
            if (
                currentState.showState === SHOW_STATES.OPENING &&
                prevState?.keyboardHeight !== currentState.keyboardHeight
            ) {
                cancelAnimation(position);
                showState.value = SHOW_STATES.OPEN;

                return;
            }

            if (currentState.height === 0) {
                return;
            }

            if (
                currentState.showState === SHOW_STATES.OPENING &&
                prevState?.height !== currentState.height
            ) {
                cancelAnimation(position);
                showState.value = SHOW_STATES.OPEN;

                return;
            }

            if (currentState.showState === SHOW_STATES.OPEN) {
                if (hasOpenAnimation) {
                    position.value = withSpring(
                        currentState.snapPointPosition,
                        OpenSpringConfig,
                        (isFinished) => {
                            if (isFinished && onOpenEndProp) {
                                runOnJS(onOpenEndProp)();
                            }
                        },
                    );
                } else {
                    position.value = currentState.snapPointPosition;
                    if (onOpenEndProp) {
                        runOnJS(onOpenEndProp)();
                    }
                }

                showState.value = SHOW_STATES.OPENING;

                return;
            }

            if (currentState.showState === SHOW_STATES.CLOSE) {
                if (hasCloseAnimation) {
                    position.value = withSpring(
                        0 - currentState.keyboardHeight,
                        CloseSpringConfig,
                        (isFinished) => {
                            if (isFinished) {
                                if (onCloseEndProp) {
                                    runOnJS(onCloseEndProp)();
                                }
                                runOnJS(onCloseModal)();
                            }
                        },
                    );
                } else {
                    position.value = 0 - currentState.keyboardHeight;
                    if (onCloseEndProp) {
                        runOnJS(onCloseEndProp)();
                    }
                    runOnJS(onCloseModal)();
                }

                showState.value = SHOW_STATES.CLOSING;
            }
        },
    );

    const positionWithoutRubberBand = useSharedValue(0);

    const onTapGestureHandler = useAnimatedGestureHandler<
        TapGestureHandlerGestureEvent
    >({
        onActive: () => {
            showState.value = SHOW_STATES.CLOSE;
            if (onCloseProp) {
                runOnJS(onCloseProp)();
            }
        },
    });

    const yIsNegative = useSharedValue<boolean>(true);

    const adjustPosition = (y: number) => {
        'worklet';

        const intermediatePosition = position.value - y;

        if (y > 0 && intermediatePosition < snapPointPosition.value) {
            positionWithoutRubberBand.value += y;
            position.value =
                snapPointPosition.value -
                getYWithRubberBandEffect(
                    positionWithoutRubberBand.value,
                    UIConstant.rubberBandEffectDistance,
                );

            return;
        }

        positionWithoutRubberBand.value = Math.max(
            positionWithoutRubberBand.value + y,
            0,
        );
        position.value = intermediatePosition;
    };

    const resetPosition = () => {
        'worklet';

        if (
            position.value - snapPointPosition.value >
            UIConstant.swipeThreshold
        ) {
            showState.value = SHOW_STATES.CLOSE;
            if (onCloseProp) {
                runOnJS(onCloseProp)();
            }
            return;
        }
        showState.value = SHOW_STATES.OPEN;
    };

    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const { y } = event.contentOffset;

            yIsNegative.value = y <= 0;

            const intermediatePosition = position.value - y;

            if (y <= 0 || intermediatePosition > snapPointPosition.value) {
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
                if (y <= 0 || intermediatePosition > snapPointPosition.value) {
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
