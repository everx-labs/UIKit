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

/**
 * TODO: move it to uiLocalized to format number generally!
 *
 * @param value number to format
 * @param decimalAspect predefined aspects how to format number
 * @param decimalSeparator localized separator from user's device
 * @param integerGroupChar localized char for group from user's device
 * @returns formatter number as string
 */
export function runOnUILocalizedNumberFormat(
    value: number,
    decimalAspect: UINumberDecimalAspect,
    decimalSeparator: string,
    integerGroupChar: string,
) {
    'worklet';

    const integer = Math.trunc(value);
    const integerFormatted = groupReversed(
        integer.toString(),
        INTEGER_GROUP_SIZE,
        integerGroupChar,
    );

    if (decimalAspect === DECIMAL_ASPECT_NONE) {
        return {
            integer: integerFormatted,
            decimal: '',
        };
    }

    const digits = getDecimalAspectDigits(decimalAspect);

    // decimal at the point would start with `0,` or `0.`
    // if it's negative it would be `-0,` or `-0.`
    let decimal = `${value - integer}`.slice(value < 0 ? 3 : 2).slice(0, digits);

    if (decimalAspect === DECIMAL_ASPECT_SHORT_ELLIPSIZED) {
        decimal = `${decimal.slice(0, DECIMAL_ASPECT_SHORT_ELLIPSIZED)}..`;
    }

    return {
        integer: integerFormatted,
        decimal: `${decimalSeparator}${decimal.padEnd(digits, '0')}`,
    };
}

export function bigNumToNumber(value: BigNumber, decimalAspect: UINumberDecimalAspect) {
    if (decimalAspect === UINumberDecimalAspect.None) {
        return value.integerValue().toNumber();
    }

    /**
     * We take it with a highest precision possible to not lose data
     * then on formatting we're still going to apply correct one
     */
    const decimalDigits = getDecimalAspectDigits(DECIMAL_ASPECT_PRECISION);

    return value
        .multipliedBy(10 ** decimalDigits)
        .integerValue()
        .dividedBy(10 ** decimalDigits)
        .toNumber();
}
