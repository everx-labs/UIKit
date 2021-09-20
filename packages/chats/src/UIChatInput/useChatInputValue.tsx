import * as React from 'react';
import type { TextInput } from 'react-native';

import { useUITextViewValue } from '@tonlabs/uikit.hydrogen';

import type { OnSendText } from './types';

export function useChatInputValue({
    ref,
    onSendText: onSendTextProp,
    showMaxLengthAlert,
    resetInputHeight,
    maxInputLength,
}: {
    ref: React.RefObject<TextInput>;
    onSendText: OnSendText;
    showMaxLengthAlert: () => void;
    resetInputHeight: () => void;
    maxInputLength: number;
}) {
    const {
        inputHasValue,
        inputValue,
        clear,
        onChangeText: onBaseChangeText,
        onKeyPress: onBaseKeyPress,
    } = useUITextViewValue(ref, true);

    const onSendText = React.useCallback(() => {
        if (onSendTextProp) {
            onSendTextProp(inputValue.current);
        }

        clear();
        resetInputHeight();
    }, [onSendTextProp, clear, inputValue, resetInputHeight]);

    const onChangeText = React.useCallback(
        (text: string) => {
            onBaseChangeText(text);

            if (text.length >= maxInputLength) {
                showMaxLengthAlert();
            }
        },
        [onBaseChangeText, showMaxLengthAlert, maxInputLength],
    );

    const onKeyPress = React.useCallback(
        (e: any) => {
            // Enable only for web (in native e.key is undefined)
            const wasClearedWithEnter = onBaseKeyPress(e);

            if (wasClearedWithEnter) {
                onSendText();
                return;
            }

            const eventKey = e.key || e.nativeEvent?.key;
            if (eventKey !== 'Backspace' && inputValue.current.length === maxInputLength) {
                showMaxLengthAlert();
            }
        },
        [onSendText, onBaseKeyPress, inputValue, showMaxLengthAlert, maxInputLength],
    );

    return {
        inputHasValue,
        onChangeText,
        onKeyPress,
        onSendText,
        clear,
    };
}
