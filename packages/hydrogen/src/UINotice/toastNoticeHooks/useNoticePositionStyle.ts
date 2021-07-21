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
import { useToastNoticeOpenedYPosition } from './useToastNoticeOpenedYPosition';

const OPENED_X_POSITION = 0;
const SECURE_OFFSET = 10;
const Y_THRESHOLD = 20;
const X_THRESHOLD = 50;

type SwipeType = 'Horizontal' | 'Vertical';
type GestureHandlerContext = {
    swipeType: SwipeType,
}

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
    onClose: (() => void) | undefined,
) => {
    const openedYPosition: Animated.SharedValue<number> = useToastNoticeOpenedYPosition(
        noticeHeight,
    );

    const screenWidth = useWindowDimensions().width;
    const offsetOfElementOutsideScreen = screenWidth - SECURE_OFFSET;

    const toastNoticeState = useSharedValue<ToastNoticeState>(
        getToastNoticeState(visible),
    );
    const xPosition = useSharedValue<number>(0);
    const yPosition = useSharedValue<number>(0);

    React.useEffect(() => {
        toastNoticeState.value = getToastNoticeState(visible);
    }, [visible, toastNoticeState]);

    useAnimatedReaction(
        () => {
            return {
                toastNoticeState: toastNoticeState.value,
                openedYPosition: openedYPosition.value,
            };
        },
        (state) => {
            if (state.toastNoticeState === 'Opened') {
                yPosition.value = moveWithSpring('Open', state.openedYPosition);
                xPosition.value = moveWithSpring('Open', OPENED_X_POSITION);
            }
            if (state.toastNoticeState === 'ClosedBottom') {
                yPosition.value = moveWithSpring(
                    'Close',
                    SECURE_OFFSET,
                    onClose,
                );
            }
            if (state.toastNoticeState === 'ClosedLeft') {
                xPosition.value = moveWithSpring(
                    'Close',
                    -offsetOfElementOutsideScreen,
                    onClose,
                );
            }
            if (state.toastNoticeState === 'ClosedRight') {
                xPosition.value = moveWithSpring(
                    'Close',
                    offsetOfElementOutsideScreen,
                    onClose,
                );
            }
        },
        [visible, onClose],
    );

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, context: GestureHandlerContext) => {
            if (event.velocityX !== 0) {
                // eslint-disable-next-line no-param-reassign
                context.swipeType = 'Horizontal';
            } else {
                // eslint-disable-next-line no-param-reassign
                context.swipeType = 'Vertical';
            }
        },
        onActive: (event, context: GestureHandlerContext) => {
            if (context.swipeType === 'Vertical') {
                /** Swipe up is prohibited */
                if (event.translationY >= 0) {
                    yPosition.value =
                        openedYPosition.value + event.translationY;
                }
            } else {
                xPosition.value = event.translationX;
            }
        },
        onEnd: (event, context: GestureHandlerContext) => {
            if (
                context.swipeType === 'Horizontal' &&
                event.translationX < -X_THRESHOLD
            ) {
                toastNoticeState.value = 'ClosedLeft';
            } else if (
                context.swipeType === 'Horizontal' &&
                event.translationX > X_THRESHOLD
            ) {
                toastNoticeState.value = 'ClosedRight';
            } else if (
                context.swipeType === 'Vertical' &&
                event.translationY > Y_THRESHOLD
            ) {
                toastNoticeState.value = 'ClosedBottom';
            } else {
                /** Double assignment is hack to trigger useAnimatedReaction */
                toastNoticeState.value = 'ClosedBottom';
                toastNoticeState.value = 'Opened';
            }
        },
    });

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
    };
};
