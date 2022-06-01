import { uiLocalized } from '@tonlabs/localization';
import * as React from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { runUIOnChangeAmount } from '../../../MaterialTextView/hooks/useApplyMask/amount/runUIOnChangeAmount';

export function useAmountMaskApplyer(
    numberOfDecimalDigits: number,
    carretEndPosition: SharedValue<number>,
    skipNextOnSelectionChange: SharedValue<boolean>,
) {
    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');

    const {
        grouping: integerSeparator,
        decimal: delimeter,
        decimalGrouping: fractionalSeparator,
        decimalAlternative: delimeterAlternative,
    } = uiLocalized.localeInfo.numbers;

    return React.useCallback(
        function applyAmountMask(inputText: string) {
            'worklet';

            const { formattedText, normalizedText, carretPosition } = runUIOnChangeAmount(
                inputText,
                carretEndPosition,
                integerSeparator,
                delimeter,
                fractionalSeparator,
                lastNormalizedText,
                lastText,
                delimeterAlternative,
                numberOfDecimalDigits,
            );

            /**
             * We need to skip the next call of OnSelectionChange
             * because it will happen after the calculations above
             * and will break these calculations
             */
            // eslint-disable-next-line no-param-reassign
            skipNextOnSelectionChange.value = true;

            // selectionEnd.value = carretPosition;
            lastText.value = formattedText;
            lastNormalizedText.value = normalizedText;

            return { formattedText, normalizedText, carretPosition };
        },
        [
            carretEndPosition,
            delimeter,
            delimeterAlternative,
            fractionalSeparator,
            integerSeparator,
            lastNormalizedText,
            lastText,
            numberOfDecimalDigits,
            skipNextOnSelectionChange,
        ],
    );
}
