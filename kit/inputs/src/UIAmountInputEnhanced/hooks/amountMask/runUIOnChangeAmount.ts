import type { SharedValue } from 'react-native-reanimated';
import { runUIFormat } from './runUIFormat';
import { runUIGetNewCaretPosition } from './runUIGetNewCaretPosition';

export function runUIOnChangeAmount(
    inputText: string,
    selectionEnd: SharedValue<number>,
    integerSeparator: string,
    delimeter: string,
    fractionalSeparator: string,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
    delimeterAlternative: string[],
    countOfDecimalDigits: number | null,
) {
    'worklet';

    const { formattedText, normalizedText } = runUIFormat(
        inputText,
        delimeter,
        integerSeparator,
        fractionalSeparator,
        delimeterAlternative,
        countOfDecimalDigits,
    );

    // Adjust caret (calculation)
    const caretPosition = runUIGetNewCaretPosition(
        selectionEnd.value,
        formattedText,
        normalizedText,
        lastText.value,
        lastNormalizedText.value,
        integerSeparator,
        fractionalSeparator,
    );

    return {
        formattedText,
        normalizedText,
        caretPosition,
    };
}
