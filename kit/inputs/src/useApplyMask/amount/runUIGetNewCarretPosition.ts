import { runUIGetCarretNormalizedPosition } from './runUIGetCarretNormalizedPosition';

export function runUIGetNewCarretPosition(
    startPosition: number,
    endPosition: number,
    text: string,
    normalizedText: string,
    previousText: string,
    previousNormalizedText: string,
    integerSeparator: string,
    fractionalSeparator: string,
) {
    'worklet';

    if (normalizedText.length === previousNormalizedText.length) {
        return startPosition;
    }

    // At first we should get a carret position
    // in normalized value (ie without separators)
    const startCarretNormalizedPosition = runUIGetCarretNormalizedPosition(
        startPosition,
        previousText,
        integerSeparator,
        fractionalSeparator,
    );
    const endCarretNormalizedPosition = runUIGetCarretNormalizedPosition(
        endPosition,
        previousText,
        integerSeparator,
        fractionalSeparator,
    );

    let newCarretPosition = startCarretNormalizedPosition;

    // We calculated normalized position exactly for this
    // as we could easily understand how many symbols
    // were put, but we can do it only with normalized values
    // as it hard to count proper value with any amount of separators in it

    newCarretPosition += normalizedText.length - previousNormalizedText.length;

    if (startCarretNormalizedPosition !== endCarretNormalizedPosition) {
        newCarretPosition += endCarretNormalizedPosition - startCarretNormalizedPosition;
    }

    // Afrer we got carret position in normalized value
    // we can get through formatted value from left position
    // and count every separator that we find on our way to the
    // carret position, that's how we shift carret from normalized
    // to position in formatted string
    for (let i = 0; i < newCarretPosition; i += 1) {
        if (text[i] === integerSeparator || text[i] === fractionalSeparator) {
            newCarretPosition += 1;
        }
    }

    return newCarretPosition;
}
