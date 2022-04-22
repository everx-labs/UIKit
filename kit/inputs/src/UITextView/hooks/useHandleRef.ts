import * as React from 'react';
import type { TextInput } from 'react-native';
import type { UITextViewRef } from '../types';

export function useHandleRef(
    textInputRef: React.RefObject<TextInput>,
    passedRef: React.ForwardedRef<UITextViewRef>,
    remeasureInputHeight: (() => void) | undefined,
) {
    React.useImperativeHandle<UITextViewRef, UITextViewRef>(passedRef, () => ({
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
    }));
}
