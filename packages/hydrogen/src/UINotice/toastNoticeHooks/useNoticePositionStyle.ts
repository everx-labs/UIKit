import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedReaction,
    useAnimatedGestureHandler,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
// @ts-expect-error
import SpringConfig from 'react-native/Libraries/Animated/src/SpringConfig';
import { useToastNoticeOpenedYSnapPointPosition } from './useToastNoticeOpenedYSnapPointPosition';

const OPENED_X_POSITION = 0;
const Y_THRESHOLD = 20;
const X_THRESHOLD = 50;

type SwipeDirection = 'None' | 'Horizontal' | 'Vertical';

type ToastNoticeState =
    | 'Opened'
    | 'ClosedBottom'
    | 'ClosedLeft'
    | 'ClosedRight';

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
    return 'ClosedBottom';
};

type MoveType = 'Open' | 'Close';
const moveWithSpring = (
    moveType: MoveType,
    toValue: number,
    onClose?: () => void,
): number => {
    'worklet';

    if (moveType === 'Open') {
        return withSpring(toValue, OpenSpringConfig);
    }
    return withSpring(toValue, CloseSpringConfig, (isFinished: boolean) => {
        if (isFinished && onClose) {
            runOnJS(onClose)();
        }
    });
};

export const useNoticePositionStyle = (
    noticeHeight: Animated.SharedValue<number>,
    visible: boolean,
    isHovered: boolean,
    onCloseAnimationEnd: (() => void) | undefined,
    suspendClosingTimer: () => void,
    continueClosingTimer: () => void,
    onTap: (() => void) | undefined,
    keyboardHeight: Animated.SharedValue<number>,
) => {
    const {
        openedYSnapPointPosition,
        closedYSnapPointPosition,
    } = useToastNoticeOpenedYSnapPointPosition(noticeHeight, keyboardHeight);

    const screenWidth = useWindowDimensions().width;

    /** Place of notice */
    const toastNoticeState = useSharedValue<ToastNoticeState>(
        getToastNoticeState(visible),
    );
    /** Еhe direction in which the user swipes the notification */
    const swipeDirection = useSharedValue<SwipeDirection>('None');
    /** Dynamic X position */
    const xPosition = useSharedValue<number>(0);
    /** Dynamic Y position */
    const yPosition = useSharedValue<number>(0);
    /** Does the user hold the notification with his finger? */
    const isNoticeHeld = useSharedValue<boolean>(false);

    React.useEffect(() => {
        toastNoticeState.value = getToastNoticeState(visible);
        if (!visible) {
            suspendClosingTimer();
        }
    }, [visible, toastNoticeState, suspendClosingTimer]);

    React.useEffect(() => {
        if (toastNoticeState.value === 'Opened') {
            if (isHovered) {
                suspendClosingTimer();
            } else {
                continueClosingTimer();
            }
        }
        /** It is necessary that this callback is executed only when the isHovered is changed */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHovered]);

    useAnimatedReaction(
        () => {
            return {
                toastNoticeState: toastNoticeState.value,
                openedYSnapPointPosition: openedYSnapPointPosition.value,
                closedYSnapPointPosition: closedYSnapPointPosition.value,
            };
        },
        (state) => {
            if (state.toastNoticeState === 'Opened') {
                yPosition.value = moveWithSpring(
                    'Open',
                    state.openedYSnapPointPosition,
                );
                xPosition.value = moveWithSpring('Open', OPENED_X_POSITION);
            }
            if (state.toastNoticeState === 'ClosedBottom') {
                yPosition.value = moveWithSpring(
                    'Close',
                    state.closedYSnapPointPosition,
                    onCloseAnimationEnd,
                );
            }
            if (state.toastNoticeState === 'ClosedLeft') {
                xPosition.value = moveWithSpring(
                    'Close',
                    -screenWidth,
                    onCloseAnimationEnd,
                );
            }
            if (state.toastNoticeState === 'ClosedRight') {
                xPosition.value = moveWithSpring(
                    'Close',
                    screenWidth,
                    onCloseAnimationEnd,
                );
            }
        },
    );

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event) => {
            if (toastNoticeState.value === 'Opened') {
                isNoticeHeld.value = true;
                if (Math.abs(event.velocityX) >= Math.abs(event.velocityY)) {
                    swipeDirection.value = 'Horizontal';
                } else {
                    swipeDirection.value = 'Vertical';
                }
            }
        },
        onActive: (event) => {
            if (toastNoticeState.value === 'Opened') {
                if (!isNoticeHeld.value) {
                    isNoticeHeld.value = true;
                }
                if (swipeDirection.value === 'Vertical') {
                    /** Swipe up is prohibited */
                    if (event.translationY >= 0) {
                        yPosition.value =
                            openedYSnapPointPosition.value + event.translationY;
                    }
                } else {
                    xPosition.value = event.translationX;
                }
            }
        },
        onEnd: (event) => {
            if (toastNoticeState.value === 'Opened') {
                isNoticeHeld.value = false;
                if (
                    swipeDirection.value === 'Horizontal' &&
                    event.translationX < -X_THRESHOLD
                ) {
                    toastNoticeState.value = 'ClosedLeft';
                } else if (
                    swipeDirection.value === 'Horizontal' &&
                    event.translationX > X_THRESHOLD
                ) {
                    toastNoticeState.value = 'ClosedRight';
                } else if (
                    swipeDirection.value === 'Vertical' &&
                    event.translationY > Y_THRESHOLD
                ) {
                    toastNoticeState.value = 'ClosedBottom';
                } else {
                    /** Double assignment is hack to trigger useAnimatedReaction */
                    toastNoticeState.value = 'ClosedBottom';
                    toastNoticeState.value = 'Opened';
                }
                swipeDirection.value = 'None';
            }
        },
    });

    useAnimatedReaction(
        () => {
            return {
                isNoticeHeld: isNoticeHeld.value,
            };
        },
        (state, previousState) => {
            if (state.isNoticeHeld === previousState?.isNoticeHeld) {
                return;
            }
            if (state.isNoticeHeld) {
                runOnJS(suspendClosingTimer)();
            } else {
                runOnJS(continueClosingTimer)();
            }
        },
    );

    const onPress = (): void => {
        if (swipeDirection.value === 'None' && onTap) {
            onTap();
        }
    };

    const onLongPress = (): void => {
        isNoticeHeld.value = true;
    };

    const onPressOut = () => {
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
