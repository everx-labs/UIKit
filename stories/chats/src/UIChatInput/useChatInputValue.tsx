import * as React from 'react';

import { UITextViewRef, useUITextViewValue } from '@tonlabs/uikit.inputs';

import type { OnSendText } from './types';

export function useChatInputValue({
    ref,
    onSendText: onSendTextProp,
    maxInputLength,
    onMaxLength,
}: {
    ref: React.RefObject<UITextViewRef>;
    onSendText: OnSendText;
    maxInputLength: number;
    onMaxLength?: (maxLength: number) => void;
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
    }, [onSendTextProp, clear, inputValue]);

    const onChangeText = React.useCallback(
        (text: string) => {
            onBaseChangeText(text);

            if (text.length >= maxInputLength) {
                onMaxLength && onMaxLength(maxInputLength);
            }
        },
        [onBaseChangeText, maxInputLength, onMaxLength],
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
                onMaxLength && onMaxLength(maxInputLength);
            }
        },
        [onSendText, onBaseKeyPress, inputValue, maxInputLength, onMaxLength],
    );

    return {
        inputHasValue,
        onChangeText,
        onKeyPress,
        onSendText,
        clear,
    };
}
