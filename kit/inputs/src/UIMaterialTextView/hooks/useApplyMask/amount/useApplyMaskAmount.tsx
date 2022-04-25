/* eslint-disable no-param-reassign */
import * as React from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { uiLocalized } from '@tonlabs/localization';
import type {
    UIMaterialTextViewAmountMask,
    UIMaterialTextViewApplyMask,
    UIMaterialTextViewInputState,
} from '../../../types';
import { runUIOnChangeAmount } from './runUIOnChangeAmount';
import { UIConstants } from './constants';

function useCountOfDecimalDigits(mask: UIMaterialTextViewAmountMask | undefined): number | null {
    return React.useMemo(() => {
        switch (mask) {
            case 'AmountInteger':
                return UIConstants.aspectRatio.integer;
            case 'AmountCurrency':
                return UIConstants.aspectRatio.currency;
            case 'AmountPrecision':
                return UIConstants.aspectRatio.precision;
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

    const {
        grouping: integerSeparator,
        decimal: delimeter,
        decimalGrouping: fractionalSeparator,
        decimalAlternative: delimeterAlternative,
    } = uiLocalized.localeInfo.numbers;

    const applyMaskAmount = React.useCallback(
        (text: string): UIMaterialTextViewInputState => {
            const { formattedText, normalizedText, carretPosition } = runUIOnChangeAmount(
                text,
                selectionEnd,
                integerSeparator,
                delimeter,
                fractionalSeparator,
                lastNormalizedText,
                lastText,
                delimeterAlternative,
                countOfDecimalDigits,
            );

            /**
             * We need to skip the next call of OnSelectionChange
             * because it will happen after the calculations above
             * and will break these calculations
             */
            skipNextOnSelectionChange.value = true;

            selectionEnd.value = carretPosition;
            lastText.value = formattedText;
            lastNormalizedText.value = normalizedText;

            return { formattedText, carretPosition };
        },
        [
            selectionEnd,
            integerSeparator,
            delimeter,
            fractionalSeparator,
            lastNormalizedText,
            lastText,
            delimeterAlternative,
            countOfDecimalDigits,
            skipNextOnSelectionChange,
        ],
    );

    return applyMaskAmount;
}
