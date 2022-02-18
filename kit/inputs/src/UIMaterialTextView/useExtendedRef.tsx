import * as React from 'react';
import { TextInput, Platform } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { calculateWebInputHeight } from '../useAutogrowTextView';
import type { UIMaterialTextViewRef } from './types';

export function useExtendedRef(
    forwardedRed: React.Ref<UIMaterialTextViewRef>,
    localRef: React.RefObject<TextInput>,
    multiline: boolean | undefined,
    onChangeText: (text: string, callOnChangeProp?: boolean) => string,
    imperativeText: SharedValue<string>,
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
            console.log('changeText', text);
            // localRef.current?.setNativeProps({
            //     text,
            // });
            // eslint-disable-next-line no-param-reassign
            imperativeText.value = text;

            if (multiline) {
                if (Platform.OS === 'web') {
                    const elem = localRef.current as unknown as HTMLTextAreaElement;
                    calculateWebInputHeight(elem);
                }
            }

            onChangeText(text, callOnChangeProp);
        },
    }));
}
