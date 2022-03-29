import * as React from 'react';
import type { TextInput } from 'react-native';
import type {
    UIMaterialTextViewRef,
    UIMaterialTextViewRefChangeText,
    ImperativeChangeText,
    UIMaterialTextViewRefMoveCarret,
} from '../types';

function emptyMethod(name: string, returnedValue: any = null) {
    console.error(
        `[useExtendedRef]: You tried to call method [${name}]. This method is not implemented.`,
    );
    return returnedValue;
}

export function useExtendedRef(
    forwardedRed: React.Ref<UIMaterialTextViewRef>,
    localRef: React.RefObject<TextInput>,
    imperativeChangeText: ImperativeChangeText,
    moveCarret: UIMaterialTextViewRefMoveCarret,
    clear: () => void,
) {
    const changeText: UIMaterialTextViewRefChangeText = React.useCallback(
        function changeText(text: string, callOnChangeProp: boolean | undefined) {
            imperativeChangeText(text, { callOnChangeProp });
        },
        [imperativeChangeText],
    );

    React.useImperativeHandle<Record<string, any>, UIMaterialTextViewRef>(
        forwardedRed,
        (): UIMaterialTextViewRef => ({
            changeText,
            moveCarret,
            clear,
            isFocused: () => {
                if (!localRef.current?.isFocused) {
                    return emptyMethod('isFocused', false);
                }
                return localRef.current?.isFocused();
            },
            focus: () => {
                if (!localRef.current?.focus) {
                    return emptyMethod('focus');
                }
                return localRef.current?.focus();
            },
            blur: () => {
                if (!localRef.current?.blur) {
                    return emptyMethod('blur');
                }
                return localRef.current?.blur();
            },
        }),
    );
}
