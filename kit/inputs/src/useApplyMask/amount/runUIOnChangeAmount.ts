/* eslint-disable no-param-reassign */
import { runOnJS, SharedValue } from 'react-native-reanimated';
import type { ChangeText, MoveCarret } from '../../UIMaterialTextView/types';
import { runUIFormat } from './runUIFormat';
import { runUIGetNewCarretPosition } from './runUIGetNewCarretPosition';

export function runUIOnChangeAmount(
    rawNumber: string,
    selectionStart: SharedValue<number>,
    selectionEnd: SharedValue<number>,
    integerSeparator: string,
    delimeter: string,
    fractionalSeparator: string,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
    changeText: ChangeText,
    moveCarret: MoveCarret,
    skipNextOnSelectionChange: SharedValue<boolean>,
    inputSeparators: string[],
) {
    'worklet';

    const { formattedNumber, normalizedText } = runUIFormat(
        rawNumber,
        delimeter,
        integerSeparator,
        fractionalSeparator,
        inputSeparators,
    );

    // Adjust carret (calculation)
    const carretPosition = runUIGetNewCarretPosition(
        selectionStart.value,
        selectionEnd.value,
        formattedNumber,
        normalizedText,
        lastText.value,
        lastNormalizedText.value,
        integerSeparator,
        fractionalSeparator,
    );

    runOnJS(changeText)(formattedNumber);
    runOnJS(moveCarret)(carretPosition, formattedNumber.length);

    skipNextOnSelectionChange.value = true;
    selectionStart.value = carretPosition;
    selectionEnd.value = carretPosition;
    lastText.value = formattedNumber;
    lastNormalizedText.value = normalizedText;
}
