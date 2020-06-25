// @flow
import BigNumber from 'bignumber.js';
import LocalizedStrings from 'react-native-localization';
import Moment from 'moment';
import 'moment/locale/ru';

import en from './en';
import ru from './ru';
import UIConstant from '../UIConstant';
import UIFunction from '../UIFunction';
import type { StringLocaleInfo, NumberPartsOptions, NumberParts } from '../UIFunction';
import type { UILocalizedData } from './UILocalizedTypes';

type LocalizedLangContent = { [string]: string };

class UILocalized extends LocalizedStrings {
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
            if (Number.isNaN(Number(numberString))) { // Check if not normalized
                throw Error('[UILocalized] Passed number is not normalized');
            }
            const isNormalized = true; // since "normalized" means "not localized"
            parts = UIFunction.getNumberParts(numberString, localeInfo, options, isNormalized);
        } catch (error) {
            // failed to get number parts with error
            parts = null;
        }
        return parts?.valueString || `${number}`;
    }

    setLanguages(languages: string[]) {
        const props = {};
        languages.forEach((language) => {
            let strings = null;
            if (language === 'en') {
                strings = en;
            } else if (language === 'ru') {
                strings = ru;
            } else {
                // not supported
            }
            props[language] = strings;
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
        preferedLanguage: string = this.getInterfaceLanguage(),
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
        this.setLanguage(preferedLanguage);
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

const localized: UILocalizedData &
    UILocalized &
    LocalizedStringsMethods = new UILocalized({ en }); // by default only `en` is used

Moment.locale(localized.getLocale());

export function formatTime(time: number): string {
    return Moment(time).format('LT');
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
        Moment(time).format('D MMM LT')
    );
}

export default localized;
