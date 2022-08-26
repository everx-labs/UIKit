import type BigNumber from 'bignumber.js';

// @inline
export const DECIMAL_ASPECT_NONE = 1;
// @inline
export const DECIMAL_ASPECT_PRECISION = 2;
// @inline
export const DECIMAL_ASPECT_SHORT = 3;
// @inline
export const DECIMAL_ASPECT_SHORT_ELLIPSIZED = 4;
// @inline
export const DECIMAL_ASPECT_MEDIUM = 5;

export enum UINumberDecimalAspect {
    None = DECIMAL_ASPECT_NONE,
    Precision = DECIMAL_ASPECT_PRECISION,
    Short = DECIMAL_ASPECT_SHORT,
    ShortEllipsized = DECIMAL_ASPECT_SHORT_ELLIPSIZED,
    Medium = DECIMAL_ASPECT_MEDIUM,
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
// @inline
const DECIMAL_GROUP_SIZE = 3;

function getIntegerSign(integer: BigNumber, showPositiveSign?: boolean) {
    'worklet';

    if (integer.lt(0)) {
        return '-';
    }

    if (showPositiveSign && integer.gt(0)) {
        return '+';
    }

    return '';
}

export function formatNumber(
    value: BigNumber,
    decimalDigitCount: number,
    decimalSeparator: string,
    integerGroupChar: string,
    showPositiveSign?: boolean,
) {
    'worklet';

    const integer = value.integerValue(Rounding.RoundDown);
    const integerFormatted = `${getIntegerSign(value, showPositiveSign)}${integer
        .abs()
        .toFormat(0, Rounding.RoundDown, {
            groupSize: INTEGER_GROUP_SIZE,
            groupSeparator: integerGroupChar,
        })}`;

    // decimal at the point would start with `0,` or `0.`
    // if it's negative it would be `-0,` or `-0.`
    const decimal = value.minus(integer);
    const decimalFormatted = decimal
        .toFormat(decimalDigitCount, Rounding.RoundDown, {
            decimalSeparator,
            fractionGroupSize: DECIMAL_GROUP_SIZE,
            fractionGroupSeparator: ' ',
        })
        .slice(decimal.lt(0) ? 2 : 1);

    return {
        integer: integerFormatted,
        decimal: decimalFormatted,
    };
}

/**
 * @param value number to format
 * @param decimalAspect predefined aspects how to format number
 * @param decimalDigitCount count of digits in decimal part of the number
 * @param decimalSeparator localized separator from user's device
 * @param integerGroupChar localized char for group from user's device
 * @returns formatter number as string
 */
export function localizedNumberFormat(
    value: BigNumber,
    decimalAspect: UINumberDecimalAspect,
    decimalDigitCount: number,
    decimalSeparator: string,
    integerGroupChar: string,
    showPositiveSign: boolean | undefined,
) {
    'worklet';

    const { integer: integerFormatted, decimal: decimalFormatted } = formatNumber(
        value,
        decimalDigitCount,
        decimalSeparator,
        integerGroupChar,
        showPositiveSign,
    );

    if (decimalAspect === DECIMAL_ASPECT_NONE) {
        return {
            integer: integerFormatted,
            decimal: '',
        };
    }

    if (decimalAspect === DECIMAL_ASPECT_SHORT_ELLIPSIZED) {
        return {
            integer: integerFormatted,
            decimal: `${decimalFormatted}..`,
        };
    }

    return {
        integer: integerFormatted,
        decimal: decimalFormatted,
    };
}
