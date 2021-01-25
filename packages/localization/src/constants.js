// @flow
import BigNumber from 'bignumber.js';

export type LanguageConstants = {
    [string]: any,
}

export const predefinedConstants: LanguageConstants = {
    CURRENT_YEAR: (new Date()).getFullYear(),
};

export type LanguageInfo = {
    name: string,
    country: string, // Works with UICountryPicker
    dayJS: string, // Works with DayJS
}

export const languagesInfo: { [string]: LanguageInfo } = {
    en: {
        name: 'English',
        country: 'US',
        dayJS: 'en',
    },
    ru: {
        name: 'Русский',
        country: 'RU',
        dayJS: 'ru',
    },
    fr: {
        name: 'Français',
        country: 'FR',
        dayJS: 'fr',
    },
    it: {
        name: 'Italiano',
        country: 'IT',
        dayJS: 'it',
    },
    tr: {
        name: 'Türkçe',
        country: 'TR',
        dayJS: 'tr',
    },
    ko: {
        name: '한국어',
        country: 'KR',
        dayJS: 'ko',
    },
    pt_BR: {
        name: 'Português (Br)',
        country: 'BR',
        dayJS: 'pt-br',
    },
    de: {
        name: 'Deutsch',
        country: 'DE',
        dayJS: 'de',
    },
    es: {
        name: 'Español',
        country: 'ES',
        dayJS: 'es',
    },
    zh_CN: {
        name: '汉语',
        country: 'CN',
        dayJS: 'zh-cn',
    },
    ja: {
        name: '日本語',
        country: 'JP',
        dayJS: 'ja',
    },
};

export const UIConstant = {
    maxDecimalDigits: 9,
};

interface BigNum {
    eq: (x: BigNum) => boolean;
    lt: (x: BigNum) => boolean;
    gt: (x: BigNum) => boolean;
    lte: (x: BigNum) => boolean;
    gte: (x: BigNum) => boolean;

    plus: (x: BigNum) => BigNum;
    minus: (x: BigNum) => BigNum;
    times: (x: BigNum) => BigNum;
    div: (x: BigNum) => BigNum;
    negated: () => BigNum;
    abs: () => BigNum;

    toFixed: (z?: number) => string;
    toNumber: () => number;
}

export type NumberParts = {
    value: BigNum,
    integer: string,
    decimal: string,
    valueString: string,
};

export type NumberPartsOptions = {
    minimumFractionDigits: number,
    maximumFractionDigits: number,
};

type NumberFormatInfo = {
    grouping: string,
    thousands: string,
    decimal: string,
    decimalGrouping: string,
};

// This stores the order of the date and the separator character
// for a locale configuration. i.e.  for the date: 07.06.1986
// the position for each part is: day = 0, month = 1, year = 2
// and the separator is: '.'
type DateFormatInfo = {
    separator: string,
    localePattern: string,
    components: string[],
};

export type StringLocaleInfo = {
    name: string,
    numbers: NumberFormatInfo,
    dates: DateFormatInfo,
};

export const UIFunction = {
    // Allows to print small numbers with "-e" suffix
    getNumberString(number: number | BigNum, digits: number = 10): string {
        // $FlowExpectedError
        if (!(number instanceof BigNumber) && Math.abs(number) > 1) {
            // Apply BigNumber conversion only for non-small numbers!
            try {
                return new BigNumber(number.toString()).toString();
            } catch (error) {
                // Failed to convert the number to string with BigNumber instance
            }
        }
        return number.toFixed(digits).replace(/\.?0+$/, '');
    },

    getNumberParts(
        value: string,
        localeInfo: StringLocaleInfo,
        options: NumberPartsOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 9,
        },
        isNormalized: boolean = false,
    ): ?NumberParts {
        // Normalize passed value
        const normalizedValue = isNormalized
            ? value
            : UIFunction.normalizedAmount(value, localeInfo);
        if (
            normalizedValue === undefined ||
            normalizedValue === null ||
            Number.isNaN(Number(normalizedValue))
        ) {
            // The string can't be parsed as a number
            return null;
        }
        // If the string contains more than one decimal separator return null.
        const defaultSeparator = '.';
        const splitParts = normalizedValue.split(defaultSeparator);
        // Two is the max number of parts
        if (splitParts.length > 2) {
            // The string can't be parsed as a number with more than one separator
            return null;
        }
        // Calculate and combine the result values into a single TONNumberParts object
        const result = {
            value: new BigNumber(0),
            integer: '0',
            decimal: '',
            valueString: '0',
        };
        // Fix value by rounding it from above
        const fixedValue =
            (splitParts[1]?.length || 0) > options.maximumFractionDigits
                ? UIFunction.toFixedDown(
                      normalizedValue,
                      options.maximumFractionDigits,
                  )
                : normalizedValue;
        // Remove unwanted leading zeros and trailing whitespaces
        const trimmedValue = fixedValue.replace(/^0+/, '').trim();
        const plainValue =
            !trimmedValue.length || trimmedValue.startsWith(defaultSeparator)
                ? `0${trimmedValue}`
                : trimmedValue;
        // Set resulted value
        result.value = new BigNumber(plainValue);
        // Find value components
        const components = plainValue.split(defaultSeparator);
        result.integer = components[0] || '0';
        result.decimal = components[1] || '';
        const trailingZerosToAdd =
            options.minimumFractionDigits - result.decimal.length;
        if (trailingZerosToAdd > 0) {
            result.decimal = `${result.decimal}${'0'.repeat(
                trailingZerosToAdd,
            )}`;
        }
        // Localize value string
        const integerString = result.integer.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            localeInfo.numbers.thousands,
        );
        const separatorString =
            plainValue.indexOf(defaultSeparator) >= 0 || trailingZerosToAdd > 0
                ? localeInfo.numbers.decimal
                : '';
        const decimalString = result.decimal || '';
        const decFormatted =
            decimalString
                .match(/.{1,3}/g)
                ?.join(localeInfo.numbers.decimalGrouping) || '';
        result.valueString = `${integerString}${separatorString}${decFormatted}`;
        // Return result
        return result;
    },

    toFixedDown(number: number | string, fixed: number = 2) {
        const reg = new RegExp(`(^-?\\d+\\.\\d{${fixed}})`);
        const match = number.toString().match(reg);
        return match ? match[0] : Number(number).toFixed(fixed);
    },

    normalizedAmount(s: ?string, localeInfo: StringLocaleInfo): ?string {
        if (s === undefined || s === null) {
            return null;
        }
        let normalized = UIFunction.replaceAll(`${s}`, ' ', '');
        const {
            grouping,
            thousands,
            decimal,
            decimalGrouping,
        } = localeInfo.numbers;
        normalized = UIFunction.replaceAll(normalized, grouping, '');
        normalized = UIFunction.replaceAll(normalized, thousands, '');
        normalized = UIFunction.replaceAll(normalized, decimalGrouping, '');
        normalized = normalized.replace(decimal, '.');
        return normalized;
    },

    replaceAll(s: string, search: string, replace: string): string {
        if (search === '') {
            return s;
        }
        return s.split(search).join(replace);
    },
};
