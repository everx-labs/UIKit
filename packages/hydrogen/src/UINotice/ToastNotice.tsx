import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedReaction,
    useAnimatedGestureHandler,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
// import { Portal } from '../Portal';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Portal } from '@tonlabs/uikit.hydrogen';
import type { UINoticeProps } from './types';
import { Notice } from './Notice';

const OPENED_Y_POSITION = -100;
const CLOSED_Y_POSITION = 10;
const Y_THRESHOLD = 20;
const X_THRESHOLD = 200;

// eslint-disable-next-line no-shadow
enum ToastNoticeState {
    Opened = 'Opened',
    ClosedBottom = 'ClosedBottom',
    ClosedLeft = 'ClosedLeft',
    ClosedRight = 'ClosedRight',
}

const getToastNoticeState = (visible: boolean): ToastNoticeState => {
    if (visible) {
        return ToastNoticeState.Opened;
    }
    return ToastNoticeState.ClosedBottom;
};

export const ToastNotice: React.FC<UINoticeProps> = ({
    type,
    color,
    visible,
    title,
    onTap,
    onClose,
    testID,
}: UINoticeProps) => {
    const panHandlerRef = React.useRef<PanGestureHandler>(null);
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
            return toastNoticeState.value;
        },
        (state: ToastNoticeState) => {
            if (state === ToastNoticeState.Opened) {
                yPosition.value = withSpring(OPENED_Y_POSITION);
                xPosition.value = withSpring(0);
            }
            if (state === ToastNoticeState.ClosedBottom) {
                yPosition.value = withSpring(
                    CLOSED_Y_POSITION,
                    {
                        overshootClamping: true,
                    },
                    (isFinished: boolean) => {
                        if (isFinished && visible && onClose) {
                            runOnJS(onClose)();
                        }
                    },
                );
            }
            if (
                state === ToastNoticeState.ClosedLeft ||
                state === ToastNoticeState.ClosedRight
            ) {
                const toValue =
                    state === ToastNoticeState.ClosedLeft ? -1000 : 1000;
                xPosition.value = withSpring(
                    toValue,
                    {
                        overshootClamping: true,
                    },
                    (isFinished: boolean) => {
                        if (isFinished && visible && onClose) {
                            runOnJS(onClose)();
                        }
                    },
                );
            }
        },
        [visible, onClose],
    );

    type GestureHandlerContext = {
        velocityX: number,
        velocityY: number,
    }
    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event, context: GestureHandlerContext) => {
            if (event.translationY >= 0) {
                yPosition.value = OPENED_Y_POSITION + event.translationY;
            }
            // eslint-disable-next-line no-param-reassign
            context.velocityX = event.velocityX
            // eslint-disable-next-line no-param-reassign
            context.velocityY = event.velocityY

            xPosition.value = event.translationX;
        },
        onEnd: (event) => {
            if (event.translationX < -X_THRESHOLD) {
                toastNoticeState.value = ToastNoticeState.ClosedLeft;
            } else if (event.translationX > X_THRESHOLD) {
                toastNoticeState.value = ToastNoticeState.ClosedRight;
            } else if (event.translationY > Y_THRESHOLD) {
                toastNoticeState.value = ToastNoticeState.ClosedBottom;
            } else {
                yPosition.value = withSpring(OPENED_Y_POSITION);
                xPosition.value = withSpring(0);
            }
        },
    });

    const noticeStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
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
    return (
        <Portal absoluteFill>
            <View style={styles.container}>
                <PanGestureHandler
                    ref={panHandlerRef}
                    onGestureEvent={gestureHandler}
                >
                    <Animated.View style={noticeStyle}>
                        <Notice
                            type={type}
                            title={title}
                            color={color}
                            onTap={onTap}
                            testID={testID}
                        />
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 0,
        bottom: 0,
        left: 40,
        right: 40,
        alignItems: 'center',
    },
});
