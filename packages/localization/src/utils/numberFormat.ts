import BigNumber from 'bignumber.js';
// import Animated from 'react-native-reanimated';
import { uiLocalized } from '../service';

type NumberFormatSettings = {
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
    settings?: NumberFormatSettings,
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

export const numberFormat = (
    value: number | BigNumber,
    settings?: NumberFormatSettings,
): string => {
    let bigNumberValue: BigNumber;
    if (!BigNumber.isBigNumber(value)) {
        try {
            bigNumberValue = new BigNumber(value);
        } catch (error) {
            if (__DEV__) {
                console.error(
                    `numberFormat: Failed to convert the number to BigNumber`,
                );
            }
            return value.toFixed(settings && settings.digitsAfterDecimalPoint);
        }
    } else {
        bigNumberValue = value;
    }
    return formatBigNumber(bigNumberValue, settings);
};

/**
 * @worklet
 */
const convertPowerOfThousandToPowerOfTenForDecimalSuffixesOnUI = (
    powerOfThousand: number,
): PowerOfTenForDecimalSuffixes => {
    'worklet';

    const powerOfTen: number = powerOfThousand * 3;
    return powerOfTen.toFixed() as PowerOfTenForDecimalSuffixes;
};

/**
 * @worklet
 */
const getSuffixOnUI = (powerOfThousand: number): string => {
    'worklet';

    const powerOfTenForDecimalSuffixes: PowerOfTenForDecimalSuffixes = convertPowerOfThousandToPowerOfTenForDecimalSuffixesOnUI(
        powerOfThousand,
    );
    return uiLocalized.DecimalSuffixes[powerOfTenForDecimalSuffixes];
};

/**
 * @worklet
 */
export const formatNumberOnUI = (
    value: number,
    settings?: NumberFormatSettings,
): string => {
    'worklet';

    const digitsAfterDecimalPoint: number =
        settings && settings.digitsAfterDecimalPoint
            ? settings.digitsAfterDecimalPoint
            : DEFAULT_DIGITS_AFTER_DECIMAL_POINT;
    
    const powerOfThousand: number = Math.floor(Math.log10(Math.abs(value)) / 3);

    if (powerOfThousand <= 0) {
        return value.toFixed(digitsAfterDecimalPoint);
    }

    const suffix: string = getSuffixOnUI(powerOfThousand);

    const scale: number = 1000 ** powerOfThousand;
    const scaledValue: number = value / scale;
    return scaledValue.toFixed(digitsAfterDecimalPoint) + (suffix || '');
};

// /*
//  * Tests
//  */
// const testsNumber = [
//     { num: 0, digits: 1 },
//     { num: 0.000000001, digits: 1 },
//     { num: 0.163456, digits: 1 },
//     { num: 12, digits: 1 },
//     { num: 1234, digits: 1 },
//     { num: 100000000, digits: 1 },
//     { num: 299792458, digits: 1 },
//     { num: 299792458123124, digits: 1 },
//     { num: 759878, digits: 1 },
//     { num: 759878, digits: 0 },
//     { num: 123, digits: 1 },
//     { num: 123.456, digits: 1 },
//     { num: 123.456, digits: 2 },
//     { num: 123.456, digits: 4 },
// ];
// const testsBigNumber = [
//     { num: new BigNumber(0), digits: 1 },
//     { num: new BigNumber(0.000000001), digits: 1 },
//     { num: new BigNumber(0.163456), digits: 1 },
//     { num: new BigNumber(12), digits: 1 },
//     { num: new BigNumber(1234), digits: 1 },
//     { num: new BigNumber(100000000), digits: 1 },
//     { num: new BigNumber(299792458), digits: 1 },
//     { num: new BigNumber(-299792458), digits: 1 },
//     { num: new BigNumber('299792458123124123123123'), digits: 1 },
//     { num: new BigNumber(759878), digits: 1 },
//     { num: new BigNumber(759878), digits: 0 },
//     { num: new BigNumber(123), digits: 1 },
//     { num: new BigNumber(123.456), digits: 1 },
//     { num: new BigNumber(123.456), digits: 2 },
//     { num: new BigNumber(-123.456), digits: 2 },
//     { num: new BigNumber(123.456), digits: 4 },
// ];
// console.log();
// testsBigNumber.forEach((test) => {
//     console.log(
//         `numberFormat(${test.num}, ${test.digits}) = ${numberFormat(test.num, {
//             digitsAfterDecimalPoint: test.digits,
//         })}`,
//     );
// });
// console.log();

