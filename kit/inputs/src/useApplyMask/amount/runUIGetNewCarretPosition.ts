import { runUIGetCarretNormalizedPosition } from './runUIGetCarretNormalizedPosition';

export function runUIGetNewCarretPosition(
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

    // At first we should get a carret position
    // in normalized value (ie without separators)
    const endCarretNormalizedPosition = runUIGetCarretNormalizedPosition(
        endPosition,
        previousText,
        integerSeparator,
        fractionalSeparator,
    );

    // We calculated normalized position exactly for this
    // as we could easily understand how many symbols
    // were put, but we can do it only with normalized values
    // as it hard to count proper value with any amount of separators in it

    let newCarretPosition =
        endCarretNormalizedPosition + normalizedText.length - previousNormalizedText.length;

    if (newCarretPosition < 0) {
        return 0;
    }

    // Afrer we got carret position in normalized value
    // we can get through formatted value from left position
    // and count every separator that we find on our way to the
    // carret position, that's how we shift carret from normalized
    // to position in formatted string
    for (let i = 0; i < newCarretPosition; i += 1) {
        if (formattedText[i] === integerSeparator || formattedText[i] === fractionalSeparator) {
            newCarretPosition += 1;
        }
    }

    return newCarretPosition;
}
