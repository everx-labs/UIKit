import type BigNumber from 'bignumber.js';

// @inline
const DECIMAL_ASPECT_NONE = 1;
// @inline
const DECIMAL_ASPECT_PRECISION = 2;
// @inline
const DECIMAL_ASPECT_SHORT = 3;
// @inline
const DECIMAL_ASPECT_SHORT_ELLIPSIZED = 4;

export enum UINumberDecimalAspect {
    None = DECIMAL_ASPECT_NONE,
    Precision = DECIMAL_ASPECT_PRECISION,
    Short = DECIMAL_ASPECT_SHORT,
    ShortEllipsized = DECIMAL_ASPECT_SHORT_ELLIPSIZED,
}

// https://mikemcl.github.io/bignumber.js/
// NB: Default value: 4 (ROUND_HALF_UP)
enum Rounding {
    RoundUP = 0,
    RoundDown = 1,
    RoundCeil = 2,
    RoundFloor = 3,
    RoundHalfUp = 4,
    RoundHalfDown = 5,
    RoundHalfEven = 6,
    RoundHalfCeil = 7,
    RoundHalfFloor = 8,
}

// TODO: move it to uiLocalized!
// @inline
const INTEGER_GROUP_SIZE = 3;

export function getDecimalAspectDigits(aspect: UINumberDecimalAspect) {
    'worklet';

    if (aspect === DECIMAL_ASPECT_SHORT_ELLIPSIZED) {
        return 1;
    }
    if (aspect === DECIMAL_ASPECT_SHORT) {
        return 2;
    }
    if (aspect === DECIMAL_ASPECT_PRECISION) {
        return 9;
    }

    return 0;
}

/**
 * TODO: move it to uiLocalized to format number generally!
 *
 * @param rawString
 * @param groupSize
 * @param groupSeparator
 * @returns
 */
const groupReversed = (rawString: string, groupSize: number, groupSeparator: string) => {
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
};

function getIntegerSign(integer: BigNumber, showPositiveSign?: boolean) {
    'worklet';

    if (showPositiveSign && integer.lt(0)) {
        return '-';
    }

    if (showPositiveSign && integer.gt(0)) {
        return '+';
    }

    return '';
}

/**
 * TODO: move it to uiLocalized to format number generally!
 *
 * @param value number to format
 * @param decimalAspect predefined aspects how to format number
 * @param decimalSeparator localized separator from user's device
 * @param integerGroupChar localized char for group from user's device
 * @returns formatter number as string
 */
export function localizedNumberFormat(
    value: BigNumber,
    decimalAspect: UINumberDecimalAspect,
    decimalSeparator: string,
    integerGroupChar: string,
    showPositiveSign?: boolean,
) {
    'worklet';

    const integer = value.integerValue(Rounding.RoundDown);
    const integerFormatted = `${getIntegerSign(value, showPositiveSign)}${groupReversed(
        integer.abs().toFixed(0, Rounding.RoundDown),
        INTEGER_GROUP_SIZE,
        integerGroupChar,
    )}`;

    if (decimalAspect === DECIMAL_ASPECT_NONE) {
        return {
            integer: integerFormatted,
            decimal: '',
        };
    }

    const digits = getDecimalAspectDigits(decimalAspect);

    // decimal at the point would start with `0,` or `0.`
    // if it's negative it would be `-0,` or `-0.`
    const decimalNumber = value.minus(value.toFixed(0, Rounding.RoundDown));
    let decimal = decimalNumber
        .toFixed(digits, Rounding.RoundDown)
        .slice(decimalNumber.lt(0) ? 3 : 2)
        .slice(0, digits);

    if (decimalAspect === DECIMAL_ASPECT_SHORT_ELLIPSIZED) {
        decimal = `${decimal}..`;
    }

    return {
        integer: integerFormatted,
        decimal: `${decimalSeparator}${decimal.padEnd(digits, '0')}`,
    };
}
