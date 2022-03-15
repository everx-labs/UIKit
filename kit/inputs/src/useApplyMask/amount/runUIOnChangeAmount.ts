import type { SharedValue } from 'react-native-reanimated';
import { runUIFormat } from './runUIFormat';
import { runUIGetNewCarretPosition } from './runUIGetNewCarretPosition';

export function runUIOnChangeAmount(
    inputText: string,
    selectionEnd: SharedValue<number>,
    integerSeparator: string,
    delimeter: string,
    fractionalSeparator: string,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
    delimeterAlternative: string[],
) {
    'worklet';

    const { formattedText, normalizedText } = runUIFormat(
        inputText,
        delimeter,
        integerSeparator,
        fractionalSeparator,
        delimeterAlternative,
    );

    // Adjust carret (calculation)
    const carretPosition = runUIGetNewCarretPosition(
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
        carretPosition,
    };
}
