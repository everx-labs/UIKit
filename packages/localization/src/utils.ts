/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */
import BigNumber from 'bignumber.js';

import type {
    DateFormatInfo,
    LanguageConstants,
    LanguageItem,
    LanguageOptions,
    Languages,
    LanguagesOptions,
    LanguageValue,
    NumberFormatInfo,
} from './types';
import { NumberParts, NumberPartsOptions, StringLocaleInfo } from './types';
import type { Language } from './constants';

function prepareArray(
    array: LanguageValue[],
    options: LanguageOptions,
): LanguageValue[] {
    return array.map((item) => prepareValue(item, options)) as LanguageValue[];
}

function prepareObject<T = LanguageItem>(
    object: LanguageItem,
    options: LanguageOptions,
): T {
    const result: any = {} as T;

    Object.keys(object).forEach((key) => {
        result[key] = prepareValue(object[key], options);
    });

    return result as T;
}

function prepareValue(
    value: LanguageValue | LanguageItem,
    options: LanguageOptions,
): LanguageItem | LanguageItem[] | LanguageValue | LanguageValue[] {
    if (Array.isArray(value)) {
        return prepareArray(value, options);
    }

    if (typeof value === 'string' || value instanceof String) {
        const { images } = options;
        if (images && /^{IMG_[A-Z_0-9]*}$/.test(value as string)) {
            const key = value.replace(/[{}]/g, '');
            return images[key];
        }

        const { constants } = options;
        if (constants) {
            const foundConstants = value.match(/{([A-Z_0-9]*)}/g);

            if (foundConstants) {
                foundConstants.forEach((constant) => {
                    const key = constant.replace(/[{}]/g, '');
                    // Filtering numerals
                    if (/[A-Z]/.test(constant)) {
                        value.replace(
                            new RegExp(constant, 'g'),
                            constants[key],
                        );
                    }
                });
            }
        }

        return value as string;
    }

    if (typeof value === 'object') {
        return prepareObject(value as LanguageItem, options);
    }

    if (typeof value === 'boolean') {
        return value;
    }

    throw new Error('Value of a wrong type was passed');
}

/**
 * Prepare localization with only string constants
 * Method works faster then prepare
 * @see prepare
 *
 * @param {Languages} langs
 * @param constants
 * @returns {Languages}
 */
export function prepareLocales<T = LanguageItem>(
    langs: Languages,
    constants: LanguageConstants,
): Languages<T> {
    const preparedLanguages: Languages = {};
    const languages: Language[] = Object.keys(langs) as Language[];

    languages.forEach((lang: Language) => {
        let content = JSON.stringify(langs[lang]) || '';

        Object.keys(constants).forEach((key: string) => {
            content = content.replace(
                new RegExp(`{${key}}`, 'g'),
                constants[key],
            );
        });

        preparedLanguages[lang] = JSON.parse(content);
    });

    return preparedLanguages as Languages<T>;
}

/**
 * Prepare localization with languages object works with images
 * Method works slower then prepareLocales
 * @see prepareLocales
 *
 * @param {Languages} langs
 * @param {Languages<LanguageOptions>} options
 * @returns {Languages}
 */
export function prepare<T>(
    langs: Languages<T>,
    options: LanguagesOptions,
): Languages<T> {
    const preparedLanguages: Languages<T> = {} as Languages<T>;
    const languages: Language[] = Object.keys(langs) as Language[];

    languages.forEach((lang) => {
        const value = langs[lang] as T;
        preparedLanguages[lang] = prepareObject(
            (value as unknown) as LanguageItem,
            options[lang] as LanguageOptions,
        );
    });

    return preparedLanguages;
}

export function getNumberFormatInfo(): NumberFormatInfo {
    const formatParser = /111(\D*)222(\D*)333(\D*)444/g;
    const parts = formatParser.exec((111222333.444).toLocaleString()) || [
        '',
        '',
        '',
        '.',
    ];
    return {
        grouping: parts[1],
        thousands: parts[2],
        decimal: parts[3],
        decimalGrouping: '\u2009',
    };
}

export function getDateFormatInfo(): DateFormatInfo {
    const date = new Date(1986, 5, 7);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    // TODO: Uncomment once updated to RN0.59
    // const options = {
    //    year: 'numeric',
    //    month: '2-digit',
    //    day: 'numeric',
    // };
    // Not working for android due to RN using JavaScriptCore engine in non-debug mode
    // const localeDate = date.toLocaleDateString(undefined, options);
    const localeDate = '07/06/1986';
    const formatParser = /(\d{1,4})(\D{1})(\d{1,4})\D{1}(\d{1,4})/g;
    const parts = formatParser.exec(localeDate) || ['', '7', '.', '6', '1986'];

    const separator = parts[2] || '.';
    const components = ['year', 'month', 'day'];
    const symbols: Record<string, string> = {
        year: 'YYYY',
        month: 'MM',
        day: 'DD',
    };

    const shortDateNumbers: number[] = [];
    const splitDate = localeDate.split(separator);
    splitDate.forEach((component) => shortDateNumbers.push(Number(component)));

    if (shortDateNumbers?.length === 3) {
        components[shortDateNumbers.indexOf(d)] = 'day';
        components[shortDateNumbers.indexOf(m)] = 'month';
        components[shortDateNumbers.indexOf(y)] = 'year';
    }

    // TODO: Need to find a better way to get the pattern.
    let localePattern = `${symbols[components[0]]}${separator}`;
    localePattern = `${localePattern}${symbols[components[1]]}`;
    localePattern = `${localePattern}${separator}${symbols[components[2]]}`;

    return {
        separator,
        localePattern,
        components,
    };
}

export class UIFunction {
    // Allows to print small numbers with "-e" suffix
    static getNumberString(
        number: number | BigNumber,
        digits: number = 10,
    ): string {
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

    static normalizedAmount(
        s: string | null,
        localeInfo: StringLocaleInfo,
    ): string | null {
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
