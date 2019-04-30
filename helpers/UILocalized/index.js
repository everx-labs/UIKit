// @flow

import LocalizedStrings from 'react-native-localization';
import Moment from 'moment';
import 'moment/locale/ru';

import en from './en';
import ru from './ru';
import type { UILocalizedData } from './UILocalizedTypes';

class UILocalized extends LocalizedStrings {
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

    localizedStringForValue(value, base) {
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
        localizedStrings,
        defaultLang = 'en',
        preferedLanguage = this.getInterfaceLanguage(),
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

    checkConsistency(localizedStrings = this.getContent()) {
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
                console.log('[UILocalized] Failed to find all transaltions for key:', key, value);
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
}

const localized: UILocalizedData & UILocalized & LocalizedStringsMethods =
    new UILocalized({ en }); // by default only `en` is used

Moment.locale(localized.getLocale());

export default localized;
