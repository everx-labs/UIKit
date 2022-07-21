import type React from 'react';
import type { UITextViewRef } from '../UITextView';

export function injectInputValue(
    animatedRef: React.RefObject<UITextViewRef>,
    _inputManagerRef: React.RefObject<InputBinder | undefined>,
    value: string,
) {
    animatedRef.current?.setNativeProps({
        text: value,
    });
}
