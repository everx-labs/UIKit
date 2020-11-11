// @flow
/* eslint-disable no-use-before-define */
import type {
    Language,
    Languages,
    LanguageOptions,
    LanguageConstants,
    NumberFormatInfo,
    DateFormatInfo,
} from '../types';


function prepareObject(object: { [string]: any }, options: LanguageOptions) {
    const result = {};
    Object.keys(object).forEach((key) => {
        result[key] = prepareValue(object[key], options);
    });
    return result;
}

function prepareArray(array: any[], options: LanguageOptions) {
    return array.map(item => prepareValue(item, options));
}

function prepareValue(value: Object | Array<any> | string | boolean, options: LanguageOptions) {
    if (Array.isArray(value)) {
        return prepareArray(value, options);
    }

    if (typeof value === 'string' || value instanceof String) {
        const { images } = options;
        if (images && /^{IMG_[A-Z_0-9]*}$/.test(value)) {
            const key = value.replace(/[{}]/g, '');
            return images[key];
        }

        const { constants } = options;
        if (constants) {
            const foundConstants = value.match(/{([A-Z_0-9]*)}/g);

            if (foundConstants) {
                foundConstants.forEach((constant) => {
                    const key = constant.replace(/[{}]/g, '');
                    value.replace(new RegExp(constant, 'g'), constants[key]);
                });
            }
        }

        return value;
    }

    if (typeof value === 'object') {
        return prepareObject(value, options);
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
 * @param {Languages<T>} langs
 * @param constants
 * @returns {Languages<T>}
 */
export function prepareLocales<T>(langs: Languages<T>, constants: LanguageConstants): Languages<T> {
    const preparedLanguages: Languages<T> = {};

    Object.keys(langs).forEach((lang: Language) => {
        let content = JSON.stringify(langs[lang]) || '';

        Object.keys(constants).forEach((key: string) => {
            content = content.replace(new RegExp(`{${key}}`, 'g'), constants[key]);
        });

        preparedLanguages[lang] = JSON.parse(content);
    });

    return preparedLanguages;
}

/**
 * Prepare localization with languages object works with images
 * Method works slower then prepareLocales
 * @see prepareLocales
 *
 * @param {Languages<T>} langs
 * @param {Languages<LanguageOptions>} options
 * @returns {Languages<T>}
 */
export function prepare<T>(langs: Languages<T>, options: Languages<LanguageOptions>): Languages<T> {
    const preparedLanguages: Languages<T> = {};

    Object.keys(langs).forEach((lang) => {
        // $FlowExpectedError Need because flow doesn't correct works with generic
        preparedLanguages[lang] = prepareObject(langs[lang], options[lang]);
    });

    return preparedLanguages;
}


export function getNumberFormatInfo(): NumberFormatInfo {
    const formatParser = /111(\D*)222(\D*)333(\D*)444/g;
    const parts = formatParser.exec(111222333.444.toLocaleString()) || ['', '', '', '.'];
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
    const symbols = {
        year: 'YYYY',
        month: 'MM',
        day: 'DD',
    };

    const shortDateNumbers = [];
    const splitDate = localeDate.split(separator);
    splitDate.forEach(component => shortDateNumbers.push(Number(component)));

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
