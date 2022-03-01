/* eslint-disable no-param-reassign */
import { runOnJS, SharedValue } from 'react-native-reanimated';
import type { ChangeText, MoveCarret } from '../UIMaterialTextView/types';

// @inline
const INTEGER_GROUP_SIZE = 3;
// @inline
const FRACTIONAL_GROUP_SIZE = 3;

// @inline
const DECIMALS = 8;

function runUIGroup(rawString: string, groupSize: number, groupSeparator: string) {
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

function runUIGroupReversed(rawString: string, groupSize: number, groupSeparator: string) {
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

function runUIGetCarretNormalizedPosition(
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

function runUIGetNewCarretPosition(
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

    console.log({
        startPosition,
        endPosition,
        text,
        normalizedText,
        previousText,
        previousNormalizedText,
        // integerSeparator,
        // fractionalSeparator,
        newCarretPosition,
        startCarretNormalizedPosition,
        endCarretNormalizedPosition,
    });

    return newCarretPosition;
}

function format(
    rawNumber: string,
    delimeter: string,
    integerSeparator: string,
    fractionalSeparator: string,
) {
    'worklet';

    const [integerPart, decimalPart] = rawNumber.split(delimeter);
    let normalizedText = '';
    const result: string[] = [];
    const notNumbersRegexp = /[^0-9]/g;

    // Normalize and group integer part
    const normalizedIntegerPart = integerPart.replace(notNumbersRegexp, '');

    normalizedText += normalizedIntegerPart;

    const groupedIntegerPart = runUIGroupReversed(
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

        const groupedDecimalPart = runUIGroup(
            normalizedDecimalPart,
            FRACTIONAL_GROUP_SIZE,
            fractionalSeparator,
        );

        result.push(groupedDecimalPart);
    }

    const formattedNumber = result.join(delimeter);

    return {
        normalizedText,
        formattedNumber,
    };
}

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
) {
    'worklet';

    const { formattedNumber, normalizedText } = format(
        rawNumber,
        delimeter,
        integerSeparator,
        fractionalSeparator,
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

    // console.log({
    //     selectionStart: selectionStart.value,
    //     selectionEnd: selectionEnd.value,
    //     formattedNumber,
    //     normalizedText,
    //     lastText: lastText.value,
    //     lastNormalizedText: lastNormalizedText.value,
    //     integerSeparator,
    //     fractionalSeparator,
    //     carretPosition,
    // });

    runOnJS(changeText)(formattedNumber);
    runOnJS(moveCarret)(carretPosition, formattedNumber.length);

    skipNextOnSelectionChange.value = true;
    selectionStart.value = carretPosition;
    selectionEnd.value = carretPosition;
    lastText.value = formattedNumber;
    lastNormalizedText.value = normalizedText;
}
