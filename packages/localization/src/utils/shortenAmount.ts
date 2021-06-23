import BigNumber from 'bignumber.js';
import { uiLocalized } from '../service';

type FormatNumberSettings = {
    fractionalDigits?: number | undefined;
};
type ShortenedNumberSuffix =
    | '3'
    | '6'
    | '9'
    | '12'
    | '15'
    | '18'
    | '21'
    | '24'
    | '27'
    | '30';

const convertPowerOfThousandToShortenedNumberSuffix = (
    powerOfThousand: number,
): ShortenedNumberSuffix => {
    const powerOfTen: number = powerOfThousand * 3;
    return powerOfTen.toFixed() as ShortenedNumberSuffix;
};

const getSuffix = (powerOfThousand: number): string => {
    const shortenedNumberSuffix: ShortenedNumberSuffix = convertPowerOfThousandToShortenedNumberSuffix(
        powerOfThousand,
    );
    return uiLocalized.ShortenedNumberSuffix[shortenedNumberSuffix];
};

const DEFAULT_FRACTIONAL_DIGITS: number = 0;
const getDractionalDigits = (settings?: FormatNumberSettings): number => {
    return settings && settings.fractionalDigits
        ? settings.fractionalDigits
        : DEFAULT_FRACTIONAL_DIGITS;
};

const getNumberOfDigitsInIntegerPartOfNumber = (value: BigNumber): number =>
    value.decimalPlaces(0, 1).precision(true);

type ShortenAmountAttributes = {
    value: string;
    suffix: string;
};
const getShortenAmountAttributes = (
    value: BigNumber,
    powerOfThousand: number,
    fractionalDigits: number,
): ShortenAmountAttributes => {
    const suffix: string = getSuffix(powerOfThousand);
    const scale: BigNumber = new BigNumber(1000).pow(powerOfThousand);
    const scaledValue: BigNumber = value.div(scale);
    const resultValue: string = scaledValue.toFixed(fractionalDigits);
    /**
     * `resultValue` can contain another power of the number.
     * For example if value = 999999 then resultValue = 1000 and result of the function is 1000K (expected 1M).
     */
    if (
        getNumberOfDigitsInIntegerPartOfNumber(new BigNumber(resultValue)) > 3
    ) {
        return getShortenAmountAttributes(
            value,
            powerOfThousand + 1,
            fractionalDigits,
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
): string => {
    const powerOfThousand: number = getPowerOfThousand(value);

    if (powerOfThousand <= 0) {
        return value.toFixed(fractionalDigits);
    }

    const shortenAmountAttributes: ShortenAmountAttributes = getShortenAmountAttributes(
        value,
        powerOfThousand,
        fractionalDigits,
    );
    return `${shortenAmountAttributes.value} ${shortenAmountAttributes.suffix}`;
};

export const shortenAmount = (
    value: number | BigNumber | null,
    settings?: FormatNumberSettings,
): string => {
    if (value === null) {
        return '';
    }

    const fractionalDigits: number = getDractionalDigits(settings);
    let bigNumberValue: BigNumber;
    if (!BigNumber.isBigNumber(value)) {
        try {
            bigNumberValue = new BigNumber(value);
        } catch (error) {
            console.error(
                `shortenAmount: Failed to convert the number to BigNumber`,
            );
            return value.toFixed(fractionalDigits);
        }
    } else {
        bigNumberValue = value;
    }
    return shortenBigNumber(bigNumberValue, fractionalDigits);
};
