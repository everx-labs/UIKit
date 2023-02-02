import { runUIGetCaretNormalizedPosition } from './runUIGetCaretNormalizedPosition';

export function runUIGetNewCaretPosition(
    endPosition: number,
    formattedText: string,
    normalizedText: string,
    previousText: string,
    previousNormalizedText: string,
    integerSeparator: string,
    fractionalSeparator: string,
) {
    'worklet';

    if (normalizedText.length === previousNormalizedText.length) {
        return endPosition;
    }

    // At first we should get a caret position
    // in normalized value (ie without separators)
    const endCaretNormalizedPosition = runUIGetCaretNormalizedPosition(
        endPosition,
        previousText,
        integerSeparator,
        fractionalSeparator,
    );

    // We calculated normalized position exactly for this
    // as we could easily understand how many symbols
    // were put, but we can do it only with normalized values
    // as it hard to count proper value with any amount of separators in it

    let newCaretPosition =
        endCaretNormalizedPosition + normalizedText.length - previousNormalizedText.length;

    if (newCaretPosition < 0) {
        return 0;
    }

    // Afrer we got caret position in normalized value
    // we can get through formatted value from left position
    // and count every separator that we find on our way to the
    // caret position, that's how we shift caret from normalized
    // to position in formatted string
    for (let i = 0; i < newCaretPosition; i += 1) {
        if (formattedText[i] === integerSeparator || formattedText[i] === fractionalSeparator) {
            newCaretPosition += 1;
        }
    }

    return newCaretPosition;
}
