import * as React from 'react';
import { TextInput, Platform } from 'react-native';
import { calculateWebInputHeight } from '../useAutogrowTextView';
import type { UIMaterialTextViewCommonProps, UIMaterialTextViewRef } from './types';

export function useExtendedRef(
    forwardedRed: React.Ref<UIMaterialTextViewRef>,
    localRef: React.RefObject<TextInput>,
    props: UIMaterialTextViewCommonProps,
    onChangeText: (text: string, callOnChangeProp?: boolean) => string,
) {
    // @ts-ignore
    React.useImperativeHandle(forwardedRed, () => ({
        // Methods of TextInput
        setNativeProps(...args) {
            return localRef.current?.setNativeProps(...args);
        },
        isFocused() {
            return localRef.current?.isFocused() || false;
        },
        focus() {
            return localRef.current?.focus();
        },
        blur() {
            return localRef.current?.blur();
        },
        clear() {
            return localRef.current?.clear();
        },
        // Custom one
        changeText: (text: string, callOnChangeProp?: boolean) => {
            localRef.current?.setNativeProps({
                text,
            });

            if (props.multiline) {
                if (Platform.OS === 'web') {
                    const elem = localRef.current as unknown as HTMLTextAreaElement;
                    calculateWebInputHeight(elem);
                }
            }

            onChangeText(text, callOnChangeProp);
        },
    }));
}
