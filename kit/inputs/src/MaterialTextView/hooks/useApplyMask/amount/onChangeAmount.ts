/* eslint-disable no-param-reassign */
import type { SharedValue } from 'react-native-reanimated';
import { uiLocalized } from '@tonlabs/localization';
import { runUIOnChangeAmount } from './runUIOnChangeAmount';
import type { MaterialTextViewInputState } from '../../../types';

export function onChangeAmount(
    inputText: string,
    selectionEnd: SharedValue<number>,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
    skipNextOnSelectionChange: SharedValue<boolean>,
    countOfDecimalDigits: number | null,
): MaterialTextViewInputState {
    const {
        grouping: integerSeparator,
        decimal: delimeter,
        decimalGrouping: fractionalSeparator,
        decimalAlternative: delimeterAlternative,
    } = uiLocalized.localeInfo.numbers;

    const { formattedText, normalizedText, carretPosition } = runUIOnChangeAmount(
        inputText,
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
}
