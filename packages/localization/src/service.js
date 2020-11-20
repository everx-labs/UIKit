// @flow
import dayjs from 'dayjs';
import LocalizedStrings from 'react-native-localization';
import BigNumber from 'bignumber.js';
import { UIConstant, UIFunction } from '@tonlabs/uikit.core';
import type { NumberParts, NumberPartsOptions } from '@tonlabs/uikit.core';

import availableLanguages from './languages';
import { getDateFormatInfo, getNumberFormatInfo, prepareLocales } from './utils';
import type {
    Language,
    Languages,
    LocalizedStringsMethods,
    StringLocaleInfo,
} from './types';
import type { UILocalizedData } from './languages/types';
import { languagesInfo, predefinedConstants } from './constants';


const preparedLanguages = prepareLocales<UILocalizedData>(availableLanguages, predefinedConstants);

const defaultLocaleInfo: StringLocaleInfo = {
    name: '',
    numbers: getNumberFormatInfo(),
    dates: getDateFormatInfo(),
};

type LanguageServiceOptions<T> = {
    languages: Languages<T>,
    localeInfo?: StringLocaleInfo
}

export class LocalizationService<T> extends LocalizedStrings {
    languages: Language[];
    localeInfo: StringLocaleInfo;

    constructor({ languages, localeInfo = defaultLocaleInfo }: LanguageServiceOptions<T>) {
        super(languages);
        this.languages = Object.keys(languages);
        this.localeInfo = localeInfo;
    }

    setLanguages = (languages: Language[]) => {
        this.languages = languages;
    }

    amountToLocale(
        number: BigNumber | string | number,
        options?: NumberPartsOptions = {
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
            parts = UIFunction.getNumberParts(numberString, this.localeInfo, options, isNormalized);
        } catch (error) {
            // failed to get number parts with error
            parts = null;
        }
        return parts?.valueString || `${number}`;
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

    changeLocaleInfo = (localeInfo: StringLocaleInfo) => {
        this.localeInfo = localeInfo;
    }

    changeLanguage = (language: Language) => {
        this.setLanguage(language);
        dayjs.locale(this.dayJSLocale);
    };

    formatTime = (time: number, format?: string = TIME_FORMAT): string => {
        return dayjs(time).format(format);
    }

    formatDate = (time: number): string => {
        const today = new Date();
        const date = new Date(time);
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        const dateTime = date.getTime();
        const isToday = todayTime === dateTime;
        const isYesterday = (todayTime - dateTime) === (24 * 3600 * 1000);

        if (isToday) {
            return this.formatString(uiLocalized.TodayAt, this.formatTime(time));
        }

        if (isYesterday) {
            return this.formatString(uiLocalized.YesterdayAt, this.formatTime(time));
        }

        return dayjs(time).format(`D MMM ${TIME_FORMAT}`);
    }

    get decimalSeparator(): string {
        return this.localeInfo.numbers.decimal;
    }

    get languageName() {
        const language = this.getLanguageFromString(this.getLanguage());
        return languagesInfo[language].name;
    }

    get dayJSLocale() {
        const language = this.getLanguageFromString(this.getLanguage());
        return languagesInfo[language].dayJS;
    }

    getLanguageFromString(language: string): Language {
        if (this.languages.includes(language)) {
            return language;
        }

        const [lang] = this.getInterfaceLanguage().split('-');

        if (this.languages.includes(lang)) {
            return lang;
        }

        return 'en';
    }
}

export type LocalizedInstance<T> = T & LocalizedStringsMethods

export const uiLocalized: LocalizedInstance<UILocalizedData>
    = (new LocalizationService<UILocalizedData>({ languages: preparedLanguages }): any);

export const TIME_FORMAT = 'HH:mm';
