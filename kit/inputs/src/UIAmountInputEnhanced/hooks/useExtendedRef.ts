import type BigNumber from 'bignumber.js';
import React from 'react';
import { runOnUI } from 'react-native-reanimated';

import type { SetText, TextAttributes, UIAmountInputEnhancedRef } from '../types';
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
    formatAmount: (amount: BigNumber | undefined) => TextAttributes,
    setText: SetText,
) {
    const changeAmount = React.useCallback(
        function changeAmount(amount: BigNumber | undefined, callOnChangeProp?: boolean) {
            const textAttributes = formatAmount(amount);
            runOnUI(setText)(textAttributes, {
                callOnChangeProp,
            });
        },
        [formatAmount, setText],
    );

    React.useImperativeHandle<Record<string, any>, UIAmountInputEnhancedRef>(
        forwardedRed,
        (): UIAmountInputEnhancedRef => ({
            clear: () => {
                changeAmount(undefined, true);
            },
            isFocused: localRef.current?.isFocused ?? getEmptyMethod('isFocused', false),
            focus: localRef.current?.focus ?? getEmptyMethod('focus'),
            blur: localRef.current?.blur ?? getEmptyMethod('blur'),
            changeAmount,
        }),
    );
}
