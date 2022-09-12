import type BigNumber from 'bignumber.js';
import {
    DECIMAL_ASPECT_MEDIUM,
    DECIMAL_ASPECT_PRECISION,
    DECIMAL_ASPECT_SHORT,
    DECIMAL_ASPECT_SHORT_ELLIPSIZED,
    UINumberDecimalAspect,
} from './localizedNumberFormat';

/**
 * Returns count of digits in decimal part of the number
 */
export function getDecimalPartDigitCount(value: BigNumber, aspect: UINumberDecimalAspect): number {
    const integerLength = value.e;
    const decimalLength = value.decimalPlaces();

    if (aspect === DECIMAL_ASPECT_SHORT_ELLIPSIZED) {
        return 1;
    }
    if (aspect === DECIMAL_ASPECT_SHORT) {
        return 2;
    }
    if (aspect === DECIMAL_ASPECT_MEDIUM) {
        return 4;
    }
    if (aspect === DECIMAL_ASPECT_PRECISION) {
        if (integerLength == null) {
            return 17;
        }
        /**
         * The total number of digits in integer and decimal parts should not exceed 18.
         * If so, we shouldn't show decimal part at all.
         */
        if (integerLength > 18) {
            return 0;
        }
        const newAspect = 18 - integerLength;
        /**
         * If the original number contains fewer deciimal digits than the `newAspect`
         */
        if (decimalLength != null && newAspect > decimalLength) {
            return decimalLength;
        }
        return newAspect;
    }

    return 0;
}
