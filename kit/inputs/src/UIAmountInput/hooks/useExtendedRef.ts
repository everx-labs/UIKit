import type BigNumber from 'bignumber.js';
import React from 'react';
import { runOnUI } from 'react-native-reanimated';

import type { SetText, TextAttributes, UIAmountInputRef } from '../types';
import type { UITextViewRef } from '../../UITextView';

function getEmptyMethod(name: string, returnedValue: any = null) {
    return function emptyMethod() {
        console.error(
            `[UIAmountInput/hooks/useExtendedRef]: You tried to call method [${name}]. This method is not implemented.`,
        );
        return returnedValue;
    };
}

export function useExtendedRef(
    forwardedRed: React.Ref<UIAmountInputRef>,
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

    React.useImperativeHandle<Record<string, any>, UIAmountInputRef>(
        forwardedRed,
        (): UIAmountInputRef => ({
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
