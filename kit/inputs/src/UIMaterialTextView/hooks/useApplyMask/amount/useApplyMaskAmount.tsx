/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type {
    ImperativeChangeText,
    MoveCarret,
    UIMaterialTextViewAmountMask,
} from '../../../types';
import { onChangeAmount } from './onChangeAmount';
import { useOnSelectionChange } from '../useOnSelectionChange';

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
    imperativeChangeText: ImperativeChangeText,
    moveCarret: MoveCarret,
    mask: UIMaterialTextViewAmountMask | undefined,
) {
    const { selectionEnd, onSelectionChange, skipNextOnSelectionChange } = useOnSelectionChange();

    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');
    const countOfDecimalDigits = useCountOfDecimalDigits(mask);

    const onChangeText = React.useCallback(
        (text: string): void => {
            onChangeAmount(
                text,
                selectionEnd,
                lastNormalizedText,
                lastText,
                imperativeChangeText,
                moveCarret,
                skipNextOnSelectionChange,
                countOfDecimalDigits,
            );
        },
        [
            selectionEnd,
            lastNormalizedText,
            lastText,
            imperativeChangeText,
            moveCarret,
            skipNextOnSelectionChange,
            countOfDecimalDigits,
        ],
    );

    return {
        onSelectionChange,
        onChangeText,
    };
}
