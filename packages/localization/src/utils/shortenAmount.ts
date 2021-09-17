import BigNumber from 'bignumber.js';
import type {
    ShortenedNumberSuffix,
    ShortenedNumberSuffixLocalization,
    ShortenAmountSettings,
    ShortenedAmountAttributes,
} from '../types';

const ShortenedNumberSuffixEnglish: ShortenedNumberSuffixLocalization = {
    3: 'K',
    6: 'M',
    9: 'B',
    12: 'T',
    15: 'Qd',
    18: 'Qn',
    21: 'Sx',
    24: 'Sp',
    27: 'Oc',
    30: 'N',
};

const convertPowerOfThousandToShortenedNumberSuffix = (
    powerOfThousand: number,
): ShortenedNumberSuffix => {
    const powerOfTen: number = powerOfThousand * 3;
    return powerOfTen.toFixed() as ShortenedNumberSuffix;
};

const getSuffix = (
    powerOfThousand: number,
    shortenedNumberSuffixLocalization: ShortenedNumberSuffixLocalization,
): string => {
    const shortenedNumberSuffix: ShortenedNumberSuffix =
        convertPowerOfThousandToShortenedNumberSuffix(powerOfThousand);
    return shortenedNumberSuffixLocalization[shortenedNumberSuffix];
};

const DEFAULT_FRACTIONAL_DIGITS: number = 0;
const getFractionalDigits = (settings?: ShortenAmountSettings): number => {
    return settings && settings.fractionalDigits !== undefined
        ? settings.fractionalDigits
        : DEFAULT_FRACTIONAL_DIGITS;
};
const DEFAULT_IS_LOCALIZED: boolean = true;
const getIsLocalized = (settings?: ShortenAmountSettings): boolean => {
    return settings && settings.isLocalized !== undefined
        ? settings.isLocalized
        : DEFAULT_IS_LOCALIZED;
};

const getNumberOfDigitsInIntegerPartOfNumber = (value: BigNumber): number =>
    value.decimalPlaces(0, 1).precision(true);

const getShortenedAmountAttributes = (
    value: BigNumber,
    powerOfThousand: number,
    fractionalDigits: number,
    shortenedNumberSuffixLocalization: ShortenedNumberSuffixLocalization,
): ShortenedAmountAttributes => {
    const suffix: string = getSuffix(powerOfThousand, shortenedNumberSuffixLocalization);
    const scale: BigNumber = new BigNumber(1000).pow(powerOfThousand);
    const scaledValue: BigNumber = value.div(scale);
    const resultValue: string = scaledValue.toFixed(fractionalDigits);
    /**
     * `resultValue` can contain another power of the number.
     * For example if value = 999999 then resultValue = 1000 and result of the function is 1000K (expected 1M).
     */
    if (getNumberOfDigitsInIntegerPartOfNumber(new BigNumber(resultValue)) > 3) {
        return getShortenedAmountAttributes(
            value,
            powerOfThousand + 1,
            fractionalDigits,
            shortenedNumberSuffixLocalization,
        );
    }
    return {
        value: resultValue,
        suffix,
    };
};

const getPowerOfThousand = (value: BigNumber): number => {
    /**
     * `value.decimalPlaces(0, 1).precision(true)` - counts the number of digits in the integer part of a number (12345678.9 -> 8)
     * `counts - 1` - the number of zeros in a round number with the same power like in 'value' (12345678 -> 10000000 -> (8 - 1) = 7)
     * `floor((counts - 1) / 3)` - power of thousand of 'value' (floor(7 / 3) = 2 -> 1000 ^ 2 = million)
     */
    return Math.floor((getNumberOfDigitsInIntegerPartOfNumber(value) - 1) / 3);
};

const shortenBigNumber = (
    value: BigNumber,
    fractionalDigits: number,
    shortenedNumberSuffixLocalization: ShortenedNumberSuffixLocalization,
): string => {
    const powerOfThousand: number = getPowerOfThousand(value);

    if (powerOfThousand <= 0) {
        return value.toFixed(fractionalDigits);
    }

    const shortenedAmountAttributes: ShortenedAmountAttributes = getShortenedAmountAttributes(
        value,
        powerOfThousand,
        fractionalDigits,
        shortenedNumberSuffixLocalization,
    );
    return `${shortenedAmountAttributes.value} ${shortenedAmountAttributes.suffix}`;
};

export const shortenAmount = (
    shortenedNumberSuffixLocalized: ShortenedNumberSuffixLocalization | undefined,
    value: number | BigNumber | null,
    settings?: ShortenAmountSettings,
): string => {
    if (value === null) {
        return '';
    }

    const isLocalized: boolean = getIsLocalized(settings);
    const shortenedNumberSuffixLocalization: ShortenedNumberSuffixLocalization =
        isLocalized && shortenedNumberSuffixLocalized
            ? shortenedNumberSuffixLocalized
            : ShortenedNumberSuffixEnglish;

    const fractionalDigits: number = getFractionalDigits(settings);
    let bigNumberValue: BigNumber;
    if (!BigNumber.isBigNumber(value)) {
        try {
            bigNumberValue = new BigNumber(value);
        } catch (error) {
            console.error(`shortenAmount: Failed to convert the number to BigNumber`);
            return value.toFixed(fractionalDigits);
        }
    } else {
        bigNumberValue = value;
    }
    return shortenBigNumber(bigNumberValue, fractionalDigits, shortenedNumberSuffixLocalization);
};
