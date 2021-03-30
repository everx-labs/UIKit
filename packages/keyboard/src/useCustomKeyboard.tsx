import * as React from 'react';
import { Keyboard, TextInput, KeyboardEvent } from 'react-native';
import type { UICustomKeyboardView } from './types';

export type OnCustomKeyboardVisible = (
    visible: boolean,
) => void | Promise<void>;

export function useCustomKeyboard(
    inputRef: React.Ref<TextInput>,
    cKeyboard?: UICustomKeyboardView,
) {
    const [customKeyboard, setCustomKeyboard] = React.useState<
        typeof cKeyboard
    >(undefined);
    const customKeyboardRef = React.useRef<typeof cKeyboard | null>(null);

    React.useEffect(() => {
        const callback = ({ duration }: KeyboardEvent) => {
            if (customKeyboardRef.current == null) {
                return;
            }

            setTimeout(() => {
                setCustomKeyboard(undefined);
            }, duration);
        };
        Keyboard.addListener('keyboardWillHide', callback);

        return () => {
            Keyboard.removeListener('keyboardWillHide', callback);
        };
    }, []);

    const dismiss = React.useCallback(() => {
        setCustomKeyboard(undefined);
        customKeyboardRef.current = null;
    }, []);

    const toggle = React.useCallback(() => {
        if (inputRef && 'current' in inputRef) {
            inputRef.current?.blur();
        }

        setCustomKeyboard(customKeyboard == null ? cKeyboard : undefined);
        customKeyboardRef.current = customKeyboard == null ? cKeyboard : null;
    }, [cKeyboard, customKeyboard, inputRef]);

    return {
        customKeyboardView: customKeyboard,
        dismiss,
        toggle,
    };
}
