/* eslint-disable no-param-reassign */
import type { SharedValue } from 'react-native-reanimated';
import type { UIMaterialTextViewRef } from '../UIMaterialTextView';

// @inline
const INTEGER_GROUP_SIZE = 3;
// @inline
const FRACTIONAL_GROUP_SIZE = 3;

// @inline
const DECIMALS = 8;

function group(rawString: string, groupSize: number, groupSeparator: string) {
    'worklet';

    let groupedPart = '';

    let i = 0;
    while (i < rawString.length) {
        if (groupSize < rawString.length - i) {
            for (let j = 0; j < groupSize; j += 1) {
                groupedPart += rawString[i + j];
            }

            groupedPart += groupSeparator;
            i += groupSize;
        } else {
            groupedPart += rawString[i];
            i += 1;
        }
    }

    return groupedPart;
}

function groupReversed(rawString: string, groupSize: number, groupSeparator: string) {
    'worklet';

    let groupedPart = '';

    let i = rawString.length;
    while (i > 0) {
        if (groupSize < i) {
            for (let j = 0; j < groupSize; j += 1) {
                groupedPart = rawString[i - j - 1] + groupedPart;
            }

            groupedPart = groupSeparator + groupedPart;
            i -= groupSize;
        } else {
            groupedPart = rawString[i - 1] + groupedPart;
            i -= 1;
        }
    }

    return groupedPart;
}

function getCarretNormalizedPosition(
    carretPosition: number,
    previousText: string,
    integerSeparator: string,
    fractionalSeparator: string,
) {
    'worklet';

    let carretNormalizedPosition = carretPosition;

    for (let i = 0; i < carretPosition; i += 1) {
        if (previousText[i] === integerSeparator || previousText[i] === fractionalSeparator) {
            carretNormalizedPosition -= 1;
        }
    }

    return carretNormalizedPosition;
}

function getNewCarretPosition(
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
    const startCarretNormalizedPosition = getCarretNormalizedPosition(
        startPosition,
        previousText,
        integerSeparator,
        fractionalSeparator,
    );
    const endCarretNormalizedPosition = getCarretNormalizedPosition(
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

export function runUIOnChangeAmount(
    rawNumber: string,
    ref: React.RefObject<UIMaterialTextViewRef>,
    selectionStart: SharedValue<number>,
    selectionEnd: SharedValue<number>,
    integerSeparator: string,
    delimeter: string,
    fractionalSeparator: string,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
) {
    'worklet';

    const [integerPart, decimalPart] = rawNumber.split(delimeter);
    let normalizedText = '';
    const result: string[] = [];
    const notNumbersRegexp = /[^0-9]/g;

    // Normalize and group integer part
    const normalizedIntegerPart = integerPart.replace(notNumbersRegexp, '');

    normalizedText += normalizedIntegerPart;

    const groupedIntegerPart = groupReversed(
        normalizedIntegerPart,
        INTEGER_GROUP_SIZE,
        integerSeparator,
    );

    result.push(groupedIntegerPart);

    // Normalize and group fractional part
    if (DECIMALS > 0 && decimalPart != null) {
        let normalizedDecimalPart = decimalPart.replace(notNumbersRegexp, '');

        normalizedDecimalPart = normalizedDecimalPart.slice(0, DECIMALS);

        normalizedText += delimeter;
        normalizedText += normalizedDecimalPart;

        const groupedDecimalPart = group(
            normalizedDecimalPart,
            FRACTIONAL_GROUP_SIZE,
            fractionalSeparator,
        );

        result.push(groupedDecimalPart);
    }

    const formattedNumber = result.join(delimeter);

    // Adjust carret (calculation)
    const carretPosition = getNewCarretPosition(
        selectionStart.value,
        selectionEnd.value,
        formattedNumber,
        normalizedText,
        lastText.value,
        lastNormalizedText.value,
        integerSeparator,
        fractionalSeparator,
    );

    // Set it to text input
    // To avoid re-rendering
    if (ref && 'current' in ref && ref.current) {
        ref.current?.setNativeProps({
            text: formattedNumber,
        });
        moveCarret(ref, carretPosition, formattedNumber.length);
    }

    selectionStart.value = carretPosition;
    lastText.value = formattedNumber;
    lastNormalizedText.value = normalizedText;
}
