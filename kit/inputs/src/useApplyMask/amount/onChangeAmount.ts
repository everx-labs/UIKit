/* eslint-disable no-param-reassign */
import type { SharedValue } from 'react-native-reanimated';
import { uiLocalized } from '@tonlabs/localization';
import { runUIOnChangeAmount } from './runUIOnChangeAmount';
import type { ChangeText, MoveCarret } from '../../UIMaterialTextView/types';

export function onChangeAmount(
    inputText: string,
    selectionEnd: SharedValue<number>,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
    changeText: ChangeText,
    moveCarret: MoveCarret,
    skipNextOnSelectionChange: SharedValue<boolean>,
) {
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
    );

    changeText(formattedText);
    moveCarret(carretPosition, formattedText.length);

    skipNextOnSelectionChange.value = true;
    selectionEnd.value = carretPosition;
    lastText.value = formattedText;
    lastNormalizedText.value = normalizedText;
}
