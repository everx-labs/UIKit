import * as React from 'react';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useSharedValue,
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureEvent,
    NativeViewGestureHandlerPayload,
    NativeViewGestureHandlerProps,
    RawButton as GHRawButton,
    RawButtonProps,
} from 'react-native-gesture-handler';
import { processColor, StyleProp, View, ViewStyle } from 'react-native';
import { maxPressDistance, PressableStateContext } from './constants';
import type { PressableProps } from './types';
import { usePressableState } from './hooks';
import { useConvertToAnimatedValue } from './hooks/useConvertToAnimatedValue';

export const RawButton = Animated.createAnimatedComponent<
    RawButtonProps &
        NativeViewGestureHandlerProps & {
            testID?: string;
            style?: StyleProp<ViewStyle>;
        }
>(GHRawButton);

/**
 * It is necessary to simplify the creation of new buttons.
 * It provides a context from which to get the current state of the component.
 *
 * To animate children colors please use `usePressableContentColor` hook in children components.
 */
export function Pressable({
    onPress,
    onLongPress,
    disabled,
    loading,
    children,
    style,
    testID,
    waitFor,
}: PressableProps) {
    const isPressed = useSharedValue(false);
    const isHovered = useSharedValue(false);
    const isDisabled = useConvertToAnimatedValue(disabled);
    const isLoading = useConvertToAnimatedValue(loading);

    const pressableState = usePressableState(isDisabled, isLoading, isPressed, isHovered);

    const onPressRef = React.useRef(onPress);
    if (onPress !== onPressRef.current) {
        onPressRef.current = onPress;
    }
    const onPressIfNeeded = React.useCallback(function onPressIfNeeded() {
        if (onPressRef.current != null) {
            onPressRef.current();
        }
    }, []);

    // Reanimated event mapping somehow freeze main thread on Android
    // It cann be seen in Logcat that there might be up to 4-5 sec
    // freeze in dev mode

    // const tap = Gesture.Tap()
    //     .onEnd((_e, success: boolean) => {
    //         success && runOnJS(onPressIfNeeded)();
    //     })
    //     .enabled(!(disabled || loading));

    // const longPress = Gesture.LongPress()
    //     .maxDistance(maxPressDistance)
    //     .shouldCancelWhenOutside(true)
    //     .onBegin(() => {
    //         // isPressed.value = true;
    //     })
    //     .onFinalize(() => {
    //         // isPressed.value = false;
    //     })
    //     .onStart(() => {
    //         // onLongPress && runOnJS(onLongPress)();
    //     })
    //     .onEnd((_e, success: boolean) => {
    //         // !onLongPress && success && onPress && runOnJS(onPress)();
    //         !onLongPress && success && runOnJS(onPressIfNeeded)();
    //     })
    //     .enabled(!(disabled || loading));

    // const tapGestures = Gesture.Simultaneous(longPress, tap);

    const gestureHandler = useAnimatedGestureHandler<GestureEvent<NativeViewGestureHandlerPayload>>(
        {
            onStart: () => {
                console.log('pressed');
                isPressed.value = true;
            },
            onFinish: () => {
                runOnJS(onPressIfNeeded)();
            },
            onCancel: () => {
                isPressed.value = false;
            },
            onEnd: () => {
                console.log('unpressed');
                isPressed.value = false;
            },
        },
    );

    return (
        <PressableStateContext.Provider value={pressableState}>
            {/* <GestureDetector gesture={tapGestures}> */}
            <RawButton
                enabled={!(disabled || loading)}
                onGestureEvent={gestureHandler}
                rippleColor={processColor('transparent')}
            >
                <View style={style} testID={testID}>
                    {children}
                </View>
            </RawButton>
            {/* </GestureDetector> */}
        </PressableStateContext.Provider>
    );
}
