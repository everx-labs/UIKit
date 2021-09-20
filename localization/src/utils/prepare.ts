/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */
import type {
    LanguageConstants,
    LanguageItem,
    LanguageOptions,
    Languages,
    LanguagesOptions,
    LanguageValue,
} from '../types';
import type { Language } from '../language';
import { LocalizationString } from '../LocalizationString';

function prepareArray(
    array: LanguageValue[],
    options: LanguageOptions,
    path: string,
): LanguageValue[] {
    return array.map(item => prepareValue(item, options, `${path}[]`)) as LanguageValue[];
}

function prepareObject<T = LanguageItem>(
    object: LanguageItem,
    options: LanguageOptions,
    path?: string,
): T {
    const result: any = {} as T;

    Object.keys(object).forEach(key => {
        result[key] = prepareValue(object[key], options, `${path ? path.concat('.') : ''}${key}`);
    });

    return result as T;
}

function prepareValue(
    value: LanguageValue | LanguageItem,
    options: LanguageOptions,
    path: string,
): LanguageItem | LanguageItem[] | LanguageValue | LanguageValue[] {
    if (typeof value === 'boolean') {
        return value;
    }

    if (Array.isArray(value)) {
        return prepareArray(value, options, path);
    }

    if (typeof value === 'string' || value instanceof String) {
        const { images, constants } = options;
        let result = value;

        if (images && /^{IMG_[A-Z_0-9]*}$/.test(value as string)) {
            const key = value.replace(/[{}]/g, '');
            return images[key];
        }

        if (constants) {
            const foundConstants = value.match(/{([A-Z_0-9]*)}/g);

            if (foundConstants) {
                foundConstants.forEach(constant => {
                    const key = constant.replace(/[{}]/g, '');
                    // Filtering numerals
                    if (/[A-Z]/.test(constant)) {
                        result = result.replace(new RegExp(constant, 'g'), constants[key]);
                    }
                });
            }
        }

        if (options.useExtendedString) {
            return new LocalizationString(result as string, path);
        }

        return result;
    }

    if (typeof value === 'object') {
        return prepareObject(value as LanguageItem, options, path);
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
            content = content.replace(new RegExp(`{${key}}`, 'g'), constants[key]);
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
 * @param {string} project - Name of project
 *
 * @returns {Languages}
 */
export function prepare<T>(
    langs: Languages<T>,
    options: LanguagesOptions,
    project?: string,
): Languages<T> {
    const preparedLanguages: Languages<T> = {} as Languages<T>;
    const languages: Language[] = Object.keys(langs) as Language[];

    languages.forEach(lang => {
        const value = langs[lang] as T;
        preparedLanguages[lang] = prepareObject(
            value as unknown as LanguageItem,
            options[lang] as LanguageOptions,
            project,
        );
    });

    return preparedLanguages;
}
