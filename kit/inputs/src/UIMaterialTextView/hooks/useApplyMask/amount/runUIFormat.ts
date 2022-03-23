import { runUIGetDelimiterRegExp } from './runUIGetDelimiterRegExp';
import { runUIGroup } from './runUIGroup';
import { runUIGroupReversed } from './runUIGroupReversed';

// @inline
const INTEGER_GROUP_SIZE = 3;
// @inline
const FRACTIONAL_GROUP_SIZE = 3;

export function runUIFormat(
    inputText: string,
    delimeter: string,
    integerSeparator: string,
    fractionalSeparator: string,
    delimeterAlternative: string[],
    countOfDecimalDigits: number | null,
) {
    'worklet';

    const inputDelimeterRegExp = runUIGetDelimiterRegExp(
        integerSeparator,
        fractionalSeparator,
        delimeterAlternative,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [integerPart, ...rest] = inputText.split(inputDelimeterRegExp);
    const decimalPart = rest.join('');

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
    if (
        (countOfDecimalDigits === null || countOfDecimalDigits > 0) &&
        decimalPart != null &&
        decimalPart.length > 0
    ) {
        let normalizedDecimalPart = decimalPart.replace(notNumbersRegexp, '');

        if (countOfDecimalDigits !== null) {
            normalizedDecimalPart = normalizedDecimalPart.slice(0, countOfDecimalDigits);
        }

        normalizedText += delimeter;
        normalizedText += normalizedDecimalPart;

        const groupedDecimalPart = runUIGroup(
            normalizedDecimalPart,
            FRACTIONAL_GROUP_SIZE,
            fractionalSeparator,
        );

        result.push(groupedDecimalPart);
    }

    const formattedText = result.join(delimeter);

    return {
        normalizedText,
        formattedText,
    };
}
