import * as React from 'react';
import type { UIMaterialTextViewRef } from '../UIMaterialTextView/types';

function getEmptyMethod(name: string, returnedValue: any = null) {
    return function emptyMethod() {
        console.error(
            `[UISeedPhraseTextView/hooks.ts]: You tried to call method [${name}]. This method is not implemented.`,
        );
        return returnedValue;
    };
}

export function useExtendedRef(
    forwardedRed: React.Ref<UIMaterialTextViewRef>,
    localRef: React.RefObject<UIMaterialTextViewRef>,
): void {
    React.useImperativeHandle<UIMaterialTextViewRef, UIMaterialTextViewRef>(
        forwardedRed,
        (): UIMaterialTextViewRef => ({
            changeText: getEmptyMethod('changeText'),
            moveCarret: getEmptyMethod('moveCarret'),
            clear: getEmptyMethod('clear'),
            isFocused: getEmptyMethod('isFocused', false),
            focus: getEmptyMethod('focus'),
            blur: getEmptyMethod('blur'),
            ...localRef.current,
        }),
    );
}
