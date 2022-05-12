import * as React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { PressableStateContext, PressableStateVariant } from './constants';
import type { PressableProps } from './types';
import { usePressed, usePressableState } from './hooks';
// import { TouchableOpacity } from '../TouchableOpacity';

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
    const { isPressed, onPressIn, onPressOut } = usePressed();
    const pressableState: PressableStateVariant = usePressableState(
        disabled,
        loading,
        isPressed,
        /** there is no hover in the mobile version */
        false,
    );

    return (
        <PressableStateContext.Provider value={pressableState}>
            <TouchableWithoutFeedback
                onPress={onPress}
                onLongPress={onLongPress}
                testID={testID}
                disabled={disabled || loading}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={style}
            >
                {children}
            </TouchableWithoutFeedback>
        </PressableStateContext.Provider>
    );
}
