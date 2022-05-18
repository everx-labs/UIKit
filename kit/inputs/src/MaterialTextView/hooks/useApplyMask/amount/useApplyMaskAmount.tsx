/* eslint-disable no-param-reassign */
import * as React from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { uiLocalized } from '@tonlabs/localization';
import type {
    MaterialTextViewAmountMask,
    MaterialTextViewApplyMask,
    MaterialTextViewInputState,
} from '../../../types';
import { runUIOnChangeAmount } from './runUIOnChangeAmount';
import { UIConstants } from '../../../constants';

function useCountOfDecimalDigits(mask: MaterialTextViewAmountMask | undefined): number | null {
    return React.useMemo(() => {
        switch (mask) {
            case 'AmountInteger':
                return UIConstants.amount.decimalAspect.integer;
            case 'AmountCurrency':
                return UIConstants.amount.decimalAspect.currency;
            case 'AmountPrecision':
                return UIConstants.amount.decimalAspect.precision;
            default:
                return null;
        }
    }, [mask]);
}

export function useApplyMaskAmount(
    mask: MaterialTextViewAmountMask | undefined,
    selectionEnd: SharedValue<number>,
    skipNextOnSelectionChange: SharedValue<boolean>,
): MaterialTextViewApplyMask {
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
        (text: string): MaterialTextViewInputState => {
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
