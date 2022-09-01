import type BigNumber from 'bignumber.js';
import React from 'react';
import type { UIAmountInputEnhancedRef } from '../types';
import type { UITextViewRef } from '../../UITextView';

function getEmptyMethod(name: string, returnedValue: any = null) {
    return function emptyMethod() {
        console.error(
            `[UIAmountInputEnhanced/hooks/useExtendedRef]: You tried to call method [${name}]. This method is not implemented.`,
        );
        return returnedValue;
    };
}

export function useExtendedRef(
    forwardedRed: React.Ref<UIAmountInputEnhancedRef>,
    localRef: React.RefObject<UITextViewRef>,
    changeAmount: (amount: BigNumber | undefined, callOnChangeProp?: boolean) => void,
) {
    React.useImperativeHandle<Record<string, any>, UIAmountInputEnhancedRef>(
        forwardedRed,
        (): UIAmountInputEnhancedRef => ({
            clear: localRef.current?.clear ?? getEmptyMethod('clear'),
            isFocused: localRef.current?.isFocused ?? getEmptyMethod('isFocused', false),
            focus: localRef.current?.focus ?? getEmptyMethod('focus'),
            blur: localRef.current?.blur ?? getEmptyMethod('blur'),
            changeAmount,
        }),
    );
}
