import * as React from 'react';
import {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedReaction,
    useAnimatedGestureHandler,
    withSpring,
    runOnJS,
    useWorkletCallback,
} from 'react-native-reanimated';
// @ts-expect-error
import SpringConfig from 'react-native/Libraries/Animated/SpringConfig';
import type { SnapPoints } from '../types';

const Y_THRESHOLD = 20;
const X_THRESHOLD = 50;

type SwipeDirection = 'None' | 'Horizontal' | 'Vertical';

type ToastNoticeState = 'Opened' | 'Closed' | 'ClosedLeft' | 'ClosedRight';

const OpenSpringConfig = {
    overshootClamping: false,
    mass: 1,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    ...SpringConfig.fromBouncinessAndSpeed(8, 12),
};

const CloseSpringConfig = {
    overshootClamping: true,
};

const getToastNoticeState = (visible: boolean): ToastNoticeState => {
    if (visible) {
        return 'Opened';
    }
    return 'Closed';
};

type MoveType = 'Open' | 'Close';
const moveWithSpring = (
    moveType: MoveType,
    toValue: number,
    onAnimationEnd: (isFinished: boolean) => void,
    onClose?: () => void,
): number => {
    'worklet';

    if (moveType === 'Open') {
        return withSpring(toValue, OpenSpringConfig, onAnimationEnd);
    }
    return withSpring(toValue, CloseSpringConfig, (isFinished: boolean) => {
        onAnimationEnd(isFinished);
        if (isFinished && onClose) {
            runOnJS(onClose)();
        }
    });
};

export const useNoticePosition = (
    xSnapPoints: SnapPoints,
    ySnapPoints: SnapPoints,
    visible: boolean,
    isHovered: boolean,
    onCloseAnimationEnd: (() => void) | undefined,
    suspendClosingTimer: () => void,
    continueClosingTimer: () => void,
    onTap: (() => void) | undefined,
) => {
    /** Place of notice */
    const toastNoticeState = useSharedValue<ToastNoticeState>(getToastNoticeState(visible));
    /** Еhe direction in which the user swipes the notification */
    const swipeDirection = useSharedValue<SwipeDirection>('None');
    /** Dynamic X position */
    const xPosition = useSharedValue<number>(xSnapPoints.openedSnapPoint.value);
    /** Dynamic Y position */
    const yPosition = useSharedValue<number>(ySnapPoints.closedSnapPoint.value);
    /** Does the user hold the notification with his finger? */
    const isNoticeHeld = useSharedValue<boolean>(false);

    React.useEffect(() => {
        toastNoticeState.value = getToastNoticeState(visible);
        if (!visible) {
            suspendClosingTimer();
        }
    }, [visible, toastNoticeState, suspendClosingTimer]);

    const onAnimationEnd = useWorkletCallback((isFinished: boolean) => {
        if (isFinished) {
            swipeDirection.value = 'None';
        }
    });

    useAnimatedReaction(
        () => {
            return {
                toastNoticeState: toastNoticeState.value,
                openedYSnapPoint: ySnapPoints.openedSnapPoint.value,
                closedYSnapPoint: ySnapPoints.closedSnapPoint.value,
                openedXSnapPoint: xSnapPoints.openedSnapPoint.value,
                closedXSnapPoint: xSnapPoints.closedSnapPoint.value,
            };
        },
        state => {
            if (state.toastNoticeState === 'Opened') {
                yPosition.value = moveWithSpring('Open', state.openedYSnapPoint, onAnimationEnd);
                xPosition.value = moveWithSpring('Open', state.openedXSnapPoint, onAnimationEnd);
            }
            if (state.toastNoticeState === 'Closed') {
                yPosition.value = moveWithSpring(
                    'Close',
                    state.closedYSnapPoint,
                    onAnimationEnd,
                    onCloseAnimationEnd,
                );
            }
            if (state.toastNoticeState === 'ClosedLeft') {
                xPosition.value = moveWithSpring(
                    'Close',
                    -state.closedXSnapPoint,
                    onAnimationEnd,
                    onCloseAnimationEnd,
                );
            }
            if (state.toastNoticeState === 'ClosedRight') {
                xPosition.value = moveWithSpring(
                    'Close',
                    state.closedXSnapPoint,
                    onAnimationEnd,
                    onCloseAnimationEnd,
                );
            }
        },
    );

    const isBottomNotice =
        ySnapPoints.openedSnapPoint.value - ySnapPoints.closedSnapPoint.value < 0;
    const gestureHandler = useAnimatedGestureHandler({
        onActive: event => {
            if (toastNoticeState.value === 'Opened') {
                if (!isNoticeHeld.value) {
                    isNoticeHeld.value = true;
                }
                if (swipeDirection.value === 'None') {
                    if (Math.abs(event.velocityX) >= Math.abs(event.velocityY)) {
                        swipeDirection.value = 'Horizontal';
                    } else {
                        swipeDirection.value = 'Vertical';
                    }
                }

                if (swipeDirection.value === 'Vertical') {
                    /** Swipe up is prohibited */
                    const isMovingAllowed = isBottomNotice
                        ? event.translationY >= 0
                        : event.translationY <= 0;
                    if (isMovingAllowed) {
                        yPosition.value = ySnapPoints.openedSnapPoint.value + event.translationY;
                    }
                } else {
                    xPosition.value = event.translationX;
                }
            }
        },
        onEnd: event => {
            if (toastNoticeState.value === 'Opened') {
                isNoticeHeld.value = false;
                const isTranslationYExceededThreshold = isBottomNotice
                    ? event.translationY > Y_THRESHOLD
                    : event.translationY < -Y_THRESHOLD;
                if (swipeDirection.value === 'Horizontal' && event.translationX < -X_THRESHOLD) {
                    toastNoticeState.value = 'ClosedLeft';
                } else if (
                    swipeDirection.value === 'Horizontal' &&
                    event.translationX > X_THRESHOLD
                ) {
                    toastNoticeState.value = 'ClosedRight';
                } else if (swipeDirection.value === 'Vertical' && isTranslationYExceededThreshold) {
                    toastNoticeState.value = 'Closed';
                } else {
                    /** Double assignment is hack to trigger useAnimatedReaction */
                    toastNoticeState.value = 'Closed';
                    toastNoticeState.value = 'Opened';
                }
            }
        },
    });

    useAnimatedReaction(
        () => {
            return {
                isNoticeHeld: isNoticeHeld.value,
                isHovered,
            };
        },
        (state, previousState) => {
            if (
                state.isNoticeHeld === previousState?.isNoticeHeld &&
                state.isHovered === previousState?.isHovered
            ) {
                return;
            }
            if (state.isNoticeHeld || state.isHovered) {
                runOnJS(suspendClosingTimer)();
            } else {
                runOnJS(continueClosingTimer)();
            }
        },
        [isHovered],
    );

    const onPress = (): void => {
        if (swipeDirection.value === 'None' && toastNoticeState.value === 'Opened' && onTap) {
            onTap();
        }
    };

    const onLongPress = (): void => {
        isNoticeHeld.value = true;
    };

    const onPressOut = (): void => {
        isNoticeHeld.value = false;
    };

    const noticePositionStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: xPosition.value,
                },
                {
                    translateY: yPosition.value,
                },
            ],
        };
    });
    return {
        noticePositionStyle,
        gestureHandler,
        onPress,
        onLongPress,
        onPressOut,
    };
};
