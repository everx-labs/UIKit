import BigNumber from 'bignumber.js';
import type {
    LanguageConstants,
    LanguageInfo,
    NumberParts,
    NumberPartsOptions,
    StringLocaleInfo
} from './types';


export const predefinedConstants: LanguageConstants = {
    CURRENT_YEAR: (new Date()).getFullYear(),
};

// eslint-disable-next-line no-shadow
export enum Language {
    En = 'en',
    Ru = 'ru',
    Fr = 'fr',
    PtBR = 'pt_BR',
    De = 'de',
    ZhCN = 'zh_CN',
    Es = 'es',
    Ja = 'ja',
    Tr = 'tr',
    It = 'it',
    Ko = 'ko',
}

export const languagesInfo: Record<Language, LanguageInfo> = {
    [Language.En]: {
        name: 'English',
        country: 'US',
        dayJS: 'en',
    },
    [Language.Ru]: {
        name: 'Русский',
        country: 'RU',
        dayJS: 'ru',
    },
    [Language.Fr]: {
        name: 'Français',
        country: 'FR',
        dayJS: 'fr',
    },
    [Language.PtBR]: {
        name: 'Português (Br)',
        country: 'BR',
        dayJS: 'pt-br',
    },
    [Language.De]: {
        name: 'Deutsch',
        country: 'DE',
        dayJS: 'de',
    },
    [Language.ZhCN]: {
        name: '汉语',
        country: 'CN',
        dayJS: 'zh-cn',
    },
    [Language.Es]: {
        name: 'Español',
        country: 'ES',
        dayJS: 'es',
    },
    [Language.Ja]: {
        name: '日本語',
        country: 'JP',
        dayJS: 'ja',
    },
    [Language.Tr]: {
        name: 'Türkçe',
        country: 'TR',
        dayJS: 'tr',
    },
    [Language.It]: {
        name: 'Italiano',
        country: 'IT',
        dayJS: 'it',
    },
    [Language.Ko]: {
        name: '한국어',
        country: 'KR',
        dayJS: 'ko',
    },
};

export const UIConstant = {
    maxDecimalDigits: 9,
};

export class UIFunction {
    // Allows to print small numbers with "-e" suffix
    static getNumberString(number: number | BigNumber, digits: number = 10): string {
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
    }

    static getNumberParts(
        value: string,
        localeInfo: StringLocaleInfo,
        options: NumberPartsOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 9,
        },
        isNormalized: boolean = false,
    ): NumberParts | null {
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
    }

    static toFixedDown(number: number | string, fixed: number = 2): string {
        const reg = new RegExp(`(^-?\\d+\\.\\d{${fixed}})`);
        const match = number.toString().match(reg);
        return match ? match[0] : Number(number).toFixed(fixed);
    }

    static normalizedAmount(s: string | null, localeInfo: StringLocaleInfo): string | null {
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
    }

    static replaceAll(s: string, search: string, replace: string): string {
        if (search === '') {
            return s;
        }

        return s.split(search).join(replace);
    }
}
