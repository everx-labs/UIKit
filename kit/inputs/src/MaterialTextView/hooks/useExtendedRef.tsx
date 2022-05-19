import * as React from 'react';
import type { UITextViewRef } from '../../UITextView';
import type {
    MaterialTextViewRef,
    MaterialTextViewRefChangeText,
    ImperativeChangeText,
    MaterialTextViewRefMoveCarret,
} from '../types';

function emptyMethod(name: string, returnedValue: any = null) {
    console.error(
        `[useExtendedRef]: You tried to call method [${name}]. This method is not implemented.`,
    );
    return returnedValue;
}

export function useExtendedRef(
    forwardedRef: React.Ref<MaterialTextViewRef>,
    localRef: React.RefObject<UITextViewRef>,
    imperativeChangeText: ImperativeChangeText,
    moveCarret: MaterialTextViewRefMoveCarret,
    clear: () => void,
) {
    const changeText: MaterialTextViewRefChangeText = React.useCallback(
        function changeText(text: string, callOnChangeProp: boolean | undefined) {
            imperativeChangeText(text, { callOnChangeProp });
        },
        [imperativeChangeText],
    );

    React.useImperativeHandle<Record<string, any>, MaterialTextViewRef>(
        forwardedRef,
        (): MaterialTextViewRef => ({
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
