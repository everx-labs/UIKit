// @flow
import BigNumber from 'bignumber.js';
import LocalizedStrings from 'react-native-localization';
import Moment from 'moment';
import 'moment/locale/ru';

import en from './en.json';
import ru from './ru.json';
import UIConstant from '../UIConstant';
import UIFunction from '../UIFunction';
import type { StringLocaleInfo, NumberPartsOptions, NumberParts } from '../UIFunction';
import type { UILocalizedData } from './types';
import { predefinedConstants } from './constants';

export type LanguageInfo = {
    name: string,
    country: string,
}

export const languagesInfo: { [string]: LanguageInfo } = {
    en: {
        name: 'English',
        country: 'US',
    },
    ru: {
        name: 'Русский',
        country: 'RU',
    },
    fr: {
        name: 'Français',
        country: 'FR',
    },
    it: {
        name: 'Italiano',
        country: 'IT',
    },
    tr: {
        name: 'Türk',
        country: 'TR',
    },
    kr: {
        name: '한국어',
        country: 'KR',
    },
};

export type Language = $Keys<typeof languagesInfo>;
export type Languages<T> = { [Language]: T }

export function prepareLocales<T>(langs: Languages<T>, constants: { [string]: any }): Languages<T> {
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

function prepareKey(object: { [string]: any }, constants: { [string]: any }) {
    // console.info(Object.keys(constants));
    Object.keys(object).forEach(key => {
        // console.info('prepareKey', key, typeof object[key]);
        if (Array.isArray(object[key])) {
            object[key].forEach(obj => {
                prepareKey(obj, constants);
            })
        }

        if (typeof object[key] === "string") {
            if (/^{IMG_[A-Z]*}$/.test(object[key])) {
                object[key] = constants[object[key].replace(/[{}]/g, '')];
            }
        }

        if (typeof object[key] === "object") {
            prepareKey(object[key], constants);
        }
    })
}

export function prepareImages<T>(langs: Languages<T>, constants: { [string]: any }): Languages<T> {
    Object.keys(langs).forEach(lang => {
        prepareKey(langs[lang], constants);
    })
}

// All available languages
const availableLanguages = { en, ru };
const languages = prepareLocales<UILocalizedData>(availableLanguages, predefinedConstants);

type LocalizedLangContent = { [string]: string };

export class UILocalizedService extends LocalizedStrings {
    // eslint-disable-next-line class-methods-use-this
    amountToLocale(
        number: BigNumber | string | number,
        localeInfo: StringLocaleInfo,
        options: NumberPartsOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: UIConstant.maxDecimalDigits(),
        },
    ): string {
        let parts: ?NumberParts;
        try {
            let numberString;
            if (number instanceof BigNumber) {
                numberString = number.toFixed();
            } else if (number instanceof String || typeof number === 'string') {
                numberString = number;
            } else { // number
                numberString = UIFunction.getNumberString(number);
            }
            const isNormalized = !Number.isNaN(Number(numberString));
            if (!isNormalized) { // Check if not normalized
                throw Error('[UILocalized] Passed number is not normalized');
            }
            parts = UIFunction.getNumberParts(numberString, localeInfo, options, isNormalized);
        } catch (error) {
            // failed to get number parts with error
            parts = null;
        }
        return parts?.valueString || `${number}`;
    }

    setLanguages(langs: Language[]) {
        const props = {};
        langs.forEach((language) => {
            props[language] = languages[language] || null;
        });
        this.setContent(props);
    }

    getLocale() {
        return this.getLanguage(); // this.getInterfaceLanguage().substring(0, 2); // en_US
    }

    localizedStringForValue(value: number, base: string) {
        let localizedString = '';
        if (value === 1) {
            localizedString = this[`${base}01`];
        } else {
            let remainder = value % 100;
            if (remainder < 11 || remainder > 14) {
                remainder %= 10;
                if (remainder === 1) {
                    const key = `${base}11`;
                    localizedString = this[key];
                } else if (remainder >= 2 && remainder <= 4) {
                    const key = `${base}24`;
                    localizedString = this[key];
                }
            }
            if (!localizedString) {
                const key = `${base}50`;
                localizedString = this[key];
            }
        }
        return `${value} ${localizedString}`;
    }

    setLocalizedStrings(
        localizedStrings: { [string]: LocalizedLangContent },
        defaultLang: string = 'en',
        preferredLanguage: string = this.getInterfaceLanguage(),
    ) {
        const localizedStringsWithDefaultLang = {
            [defaultLang]: localizedStrings[defaultLang],
        };
        Object.keys(localizedStrings).forEach((lang) => {
            if (lang === defaultLang) {
                return;
            }
            localizedStringsWithDefaultLang[lang] = localizedStrings[lang];
        });
        this.setContent(localizedStringsWithDefaultLang);
        this.setLanguage(preferredLanguage);
    }

    checkConsistency(localizedStrings: {
            [string]: LocalizedLangContent,
        } = this.getContent()) {
        const values = {};
        const langs = Object.keys(localizedStrings);
        langs.forEach((lang) => {
            const strings = localizedStrings[lang];
            Object.keys(strings).forEach((key) => {
                let value = values[key];
                if (!value) {
                    value = {};
                    values[key] = value;
                }
                value[lang] = strings[key];
            });
        });
        Object.keys(values).forEach((key) => {
            const value = values[key];
            if (Object.keys(value).length !== langs.length) {
                console.log(
                    '[UILocalized] Failed to find all transaltions for key:',
                    key,
                    value,
                );
            }
        });
    }
}

type LocalizedStringsMethods = {
    setLanguage(language?: string): void,
    getInterfaceLanguage(): string,
    getAvailableLanguages(): string[],
    formatString(str: string, ...values: any[]): string,
    getString(key: string, language: string): string | null,
};

// Enable only english language by default, other languages load in language service
const localized: UILocalizedData &
    UILocalizedService &
    LocalizedStringsMethods = new UILocalizedService({ en });

Moment.locale(localized.getLocale());

export const TIME_FORMAT = 'HH:mm';

export function formatTime(time: number, format: string = TIME_FORMAT): string {
    return Moment(time).format(format);
}

export function formatDate(time: number): string {
    const today = new Date();
    const date = new Date(time);
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const dateTime = date.getTime();
    const isToday = todayTime === dateTime;
    const isYesterday = (todayTime - dateTime) === (24 * 3600 * 1000);
    return (isToday || isYesterday) ? (
        `${isToday ? localized.Today : localized.Yesterday} at ${formatTime(time)}`
    ) : (
        Moment(time).format(`D MMM ${TIME_FORMAT}`)
    );
}

export default localized;
