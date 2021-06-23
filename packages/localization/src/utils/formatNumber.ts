import BigNumber from 'bignumber.js';
import { uiLocalized } from '../service';

type FormatNumberSettings = {
    fractionalDigits?: number | undefined;
};
type PowerOfTenForDecimalSuffixes =
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

const convertPowerOfThousandToPowerOfTenForDecimalSuffixes = (
    powerOfThousand: number,
): PowerOfTenForDecimalSuffixes => {
    const powerOfTen: number = powerOfThousand * 3;
    return powerOfTen.toFixed() as PowerOfTenForDecimalSuffixes;
};

const getSuffix = (powerOfThousand: number): string => {
    const powerOfTenForDecimalSuffixes: PowerOfTenForDecimalSuffixes = convertPowerOfThousandToPowerOfTenForDecimalSuffixes(
        powerOfThousand,
    );
    return uiLocalized.DecimalSuffixes[powerOfTenForDecimalSuffixes];
};

const DEFAULT_DIGITS_AFTER_DECIMAL_POINT: number = 0;
const getDigitsAfterDecimalPoint = (
    settings?: FormatNumberSettings,
): number => {
    return settings && settings.digitsAfterDecimalPoint
        ? settings.digitsAfterDecimalPoint
        : DEFAULT_DIGITS_AFTER_DECIMAL_POINT;
};

const getNumberOfDigitsInIntegerPartOfNumber = (value: BigNumber): number =>
    value.decimalPlaces(0, 1).precision(true);

type Result = {
    value: string;
    suffix: string;
};
const getResult = (
    value: BigNumber,
    powerOfThousand: number,
    digitsAfterDecimalPoint: number,
): Result => {
    const suffix: string = getSuffix(powerOfThousand);
    const scale: BigNumber = new BigNumber(1000).pow(powerOfThousand);
    const scaledValue: BigNumber = value.div(scale);
    const resultValue: string = scaledValue.toFixed(digitsAfterDecimalPoint);
    /** resultValue can contain another power of the number */
    if (
        getNumberOfDigitsInIntegerPartOfNumber(new BigNumber(resultValue)) > 3
    ) {
        return getResult(value, powerOfThousand + 1, digitsAfterDecimalPoint);
    }
    return {
        value: resultValue,
        suffix,
    };
};

const formatBigNumber = (
    value: BigNumber,
    settings?: FormatNumberSettings,
): string => {
    const digitsAfterDecimalPoint: number = getDigitsAfterDecimalPoint(
        settings,
    );

    const powerOfThousand: number = Math.floor(
        (getNumberOfDigitsInIntegerPartOfNumber(value) - 1) / 3,
    );

    if (powerOfThousand <= 0) {
        return value.toFixed(digitsAfterDecimalPoint);
    }

    const result: Result = getResult(
        value,
        powerOfThousand,
        digitsAfterDecimalPoint,
    );
    return result.value + result.suffix;
};

export const formatNumber = (
    value: number | BigNumber | null,
    settings?: FormatNumberSettings,
): string => {
    if (value === null) {
        return '';
    }

    const digitsAfterDecimalPoint: number = getDigitsAfterDecimalPoint(
        settings,
    );
    let bigNumberValue: BigNumber;
    if (!BigNumber.isBigNumber(value)) {
        try {
            bigNumberValue = new BigNumber(value);
        } catch (error) {
            if (__DEV__) {
                console.error(
                    `formatNumber: Failed to convert the number to BigNumber`,
                );
            }
            return value.toFixed(digitsAfterDecimalPoint);
        }
    } else {
        bigNumberValue = value;
    }
    return formatBigNumber(bigNumberValue, settings);
};
