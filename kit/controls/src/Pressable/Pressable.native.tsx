import * as React from 'react';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { maxPressDistance, PressableStateContext } from './constants';
import type { PressableProps } from './types';
import { usePressableState } from './hooks';
import { useConvertToAnimatedValue } from './hooks/useConvertToAnimatedValue';

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
}: PressableProps) {
    const isPressed = useSharedValue(false);
    const isHovered = useSharedValue(false);
    const isDisabled = useConvertToAnimatedValue(disabled);
    const isLoading = useConvertToAnimatedValue(loading);

    const pressableState = usePressableState(isDisabled, isLoading, isPressed, isHovered);

    const tap = Gesture.Tap()
        .onEnd((_e, success: boolean) => {
            success && onPress && runOnJS(onPress)();
        })
        .enabled(!(disabled || loading));

    const longPress = Gesture.LongPress()
        .maxDistance(maxPressDistance)
        .shouldCancelWhenOutside(true)
        .onBegin(() => {
            isPressed.value = true;
        })
        .onFinalize(() => {
            isPressed.value = false;
        })
        .onStart(() => {
            onLongPress && runOnJS(onLongPress)();
        })
        .onEnd((_e, success: boolean) => {
            !onLongPress && success && onPress && runOnJS(onPress)();
        })
        .enabled(!(disabled || loading));

    const tapGestures = Gesture.Simultaneous(longPress, tap);

    return (
        <PressableStateContext.Provider value={pressableState}>
            <GestureDetector gesture={tapGestures}>
                <View style={style} testID={testID}>
                    {children}
                </View>
            </GestureDetector>
        </PressableStateContext.Provider>
    );
}
