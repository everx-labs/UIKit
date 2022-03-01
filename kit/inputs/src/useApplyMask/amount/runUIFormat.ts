import { runUIGroup } from './runUIGroup';
import { runUIGroupReversed } from './runUIGroupReversed';

// @inline
const INTEGER_GROUP_SIZE = 3;
// @inline
const FRACTIONAL_GROUP_SIZE = 3;

// @inline
const DECIMALS = 8;

export function runUIFormat(
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
