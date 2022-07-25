import type React from 'react';
import type { UITextViewRef } from '../UITextView';

export function injectInputValue(
    animatedRef: React.RefObject<UITextViewRef>,
    _inputManagerRef: React.RefObject<InputBinder | undefined>,
    value: string,
    caretPosition: number,
) {
    animatedRef.current?.setNativeProps({
        text: value,
    });

    animatedRef.current?.setSelectionRange(caretPosition, caretPosition);
}
