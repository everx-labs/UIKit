import * as React from 'react';
import { useKeyboard } from '@react-native-community/hooks';
import { useSharedValue } from 'react-native-reanimated';

export function useAnimatedKeyboardHeight() {
    const keyboard = useKeyboard();
    const keyboardHeight = useSharedValue(keyboard.keyboardHeight);

    React.useEffect(() => {
        keyboardHeight.value = keyboard.keyboardShown ? keyboard.keyboardHeight : 0;
    }, [keyboard.keyboardHeight, keyboard.keyboardShown, keyboardHeight]);

    return keyboardHeight;
}
