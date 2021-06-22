import BigNumber from 'bignumber.js';
// import Animated from 'react-native-reanimated';
import { uiLocalized } from '../service';

type FormatNumberSettings = {
    digitsAfterDecimalPoint?: number | undefined;
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
const formatBigNumber = (
    value: BigNumber,
    settings?: FormatNumberSettings,
): string => {
    const digitsAfterDecimalPoint: number =
        settings && settings.digitsAfterDecimalPoint
            ? settings.digitsAfterDecimalPoint
            : DEFAULT_DIGITS_AFTER_DECIMAL_POINT;
    const powerOfThousand: number = Math.floor(
        (value.decimalPlaces(0, 1).precision(true) - 1) / 3,
    );

    if (powerOfThousand <= 0) {
        return value.toFixed(digitsAfterDecimalPoint);
    }

    const suffix: string = getSuffix(powerOfThousand);

    const scale: BigNumber = new BigNumber(1000).pow(powerOfThousand);
    const scaledValue: BigNumber = value.div(scale);
    return scaledValue.toFixed(digitsAfterDecimalPoint) + (suffix || '');
};

export const formatNumber = (
    value: number | BigNumber | null,
    settings?: FormatNumberSettings,
): string => {
    if (value === null) {
        return ''
    }

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
            return value.toFixed(settings && settings.digitsAfterDecimalPoint);
        }
    } else {
        bigNumberValue = value;
    }
    return formatBigNumber(bigNumberValue, settings);
};
