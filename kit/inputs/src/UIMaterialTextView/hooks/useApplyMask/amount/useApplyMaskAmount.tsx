/* eslint-disable no-param-reassign */
import * as React from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import type {
    UIMaterialTextViewAmountMask,
    UIMaterialTextViewApplyMask,
    UIMaterialTextViewInputState,
} from '../../../types';
import { onChangeAmount } from './onChangeAmount';

function useCountOfDecimalDigits(mask: UIMaterialTextViewAmountMask | undefined): number | null {
    return React.useMemo(() => {
        switch (mask) {
            case 'AmountInteger':
                return 0;
            case 'AmountCurrency':
                return 2;
            case 'AmountPrecision':
            default:
                return null;
        }
    }, [mask]);
}

export function useApplyMaskAmount(
    mask: UIMaterialTextViewAmountMask | undefined,
    selectionEnd: SharedValue<number>,
    skipNextOnSelectionChange: SharedValue<boolean>,
): UIMaterialTextViewApplyMask {
    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');
    const countOfDecimalDigits = useCountOfDecimalDigits(mask);

    const applyMaskAmount = React.useCallback(
        (text: string): UIMaterialTextViewInputState => {
            return onChangeAmount(
                text,
                selectionEnd,
                lastNormalizedText,
                lastText,
                skipNextOnSelectionChange,
                countOfDecimalDigits,
            );
        },
        [
            selectionEnd,
            lastNormalizedText,
            lastText,
            skipNextOnSelectionChange,
            countOfDecimalDigits,
        ],
    );

    return applyMaskAmount;
}
