import { uiLocalized } from '@tonlabs/localization';
import * as React from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { runUIOnChangeAmount } from './runUIOnChangeAmount';

export function useAmountMaskApplyer(numberOfDecimalDigits: number) {
    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');

    const {
        grouping: integerSeparator,
        decimal: delimeter,
        decimalGrouping: fractionalSeparator,
        decimalAlternative: delimeterAlternative,
    } = uiLocalized.localeInfo.numbers;

    return React.useCallback(
        function applyAmountMask(inputText: string, caretEndPosition: SharedValue<number>) {
            'worklet';

            const { formattedText, normalizedText, caretPosition } = runUIOnChangeAmount(
                inputText,
                caretEndPosition,
                integerSeparator,
                delimeter,
                fractionalSeparator,
                lastNormalizedText,
                lastText,
                delimeterAlternative,
                numberOfDecimalDigits,
            );

            // selectionEnd.value = caretPosition;
            lastText.value = formattedText;
            lastNormalizedText.value = normalizedText;

            return { formattedText, normalizedText, caretPosition };
        },
        [
            delimeter,
            delimeterAlternative,
            fractionalSeparator,
            integerSeparator,
            lastNormalizedText,
            lastText,
            numberOfDecimalDigits,
        ],
    );
}
