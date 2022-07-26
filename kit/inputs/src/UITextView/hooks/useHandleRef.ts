import * as React from 'react';
import type { TextInput } from 'react-native';
import type { UITextViewRef } from '../types';

export function useHandleRef(
    textInputRef: React.RefObject<TextInput>,
    passedRef: React.ForwardedRef<UITextViewRef>,
    remeasureInputHeight: (() => void) | undefined,
) {
    React.useImperativeHandle<UITextViewRef, UITextViewRef>(passedRef, () => ({
        // To spread actual ref is important
        // in order to work properly with `findNodeHandle`
        ...textInputRef.current,
        remeasureInputHeight: () => {
            return remeasureInputHeight?.();
        },
        clear: () => {
            return textInputRef.current?.clear();
        },
        isFocused: () => {
            return !!textInputRef.current?.isFocused();
        },
        focus: () => {
            return textInputRef.current?.focus();
        },
        blur: () => {
            return textInputRef.current?.blur();
        },
        setNativeProps: (nativeProps: any) => {
            return textInputRef.current?.setNativeProps(nativeProps);
        },
        setSelectionRange: (start: number, end: number) => {
            const textInput = textInputRef.current as any;
            if (textInput?.setSelectionRange) {
                textInput?.setSelectionRange(start, end);
                return;
            }
            if (textInput?.createTextRange) {
                const range = textInput.createTextRange();
                range.collapse(true);
                range.moveStart(start);
                range.moveEnd(end);
                range.select();
            }
        },
    }));
}
