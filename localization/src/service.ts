import dayjs from 'dayjs';
import { NativeModules } from 'react-native';
import LocalizedStringsService from 'react-native-localization';
import BigNumber from 'bignumber.js';

import availableLanguages, { UILocalizedData } from './languages';
import {
    getDateFormatInfo,
    getNumberFormatInfo,
    prepare,
    UIFunction,
    shortenAmount,
} from './utils';
import type {
    Languages,
    NumberParts,
    NumberPartsOptions,
    StringLocaleInfo,
    ShortenAmount,
    LanguagesOptions,
    LocalizationServiceMethods,
} from './types';
import { languagesInfo, predefinedConstants, UIConstant } from './constants';
import { Language } from './language';

const langsOptions: LanguagesOptions = Object.values(Language).reduce(
    (result, lang) => ({ ...result, [lang]: { constants: predefinedConstants } }),
    {},
);

export const preparedLanguages = prepare<UILocalizedData>(availableLanguages, langsOptions);

export function getExtendedLanguages() {
    const extendedOptions: LanguagesOptions = Object.values(Language).reduce(
        (result, lang) => ({
            ...result,
            [lang]: { constants: predefinedConstants, useExtendedString: true },
        }),
        {},
    );

    return prepare<UILocalizedData>(availableLanguages, extendedOptions, 'UIKit');
}

const defaultLocaleInfo: StringLocaleInfo = {
    name: '',
    numbers: getNumberFormatInfo(),
    dates: getDateFormatInfo(),
};

type LanguageServiceOptions<T> = {
    languages: Languages<T>;
    localeInfo?: StringLocaleInfo;
};

export type LocalizedStrings<T> = LocalizationServiceMethods & T;

export type LocalizedInstance<T> = LocalizedStrings<T> & LocalizationService<T>;

// @ts-ignore
export class LocalizationService<T> extends (LocalizedStringsService as LocalizedStrings<T>) {
    languages: Language[];

    localeInfo: StringLocaleInfo;

    constructor({
        languages,
        localeInfo = NativeModules.UIKitLocalization != null
            ? NativeModules.UIKitLocalization.getConstants()
            : defaultLocaleInfo,
    }: LanguageServiceOptions<T>) {
        super(languages);
        this.languages = Object.keys(languages) as Language[];
        this.localeInfo = localeInfo;
    }

    setLanguages = (languages: Language[]) => {
        this.languages = languages;
    };

    amountToLocale(
        value: BigNumber | string | number | unknown,
        options: NumberPartsOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: UIConstant.maxDecimalDigits,
        },
        localeInfo: StringLocaleInfo = this.localeInfo,
    ): string {
        let parts: NumberParts | null;
        try {
            let numberString: string;

            if (BigNumber.isBigNumber(value)) {
                numberString = value.toFixed();
            } else if (typeof value === 'string') {
                numberString = value;
            } else if (value instanceof String) {
                numberString = value.toString();
            } else if (typeof value === 'number') {
                numberString = UIFunction.getNumberString(value);
            } else {
                throw Error('[LocalizationService] Passed number is unknown type');
            }

            const isNormalized = !Number.isNaN(Number(numberString));
            if (!isNormalized) {
                // Check if not normalized
                throw Error('[LocalizationService] Passed number is not normalized');
            }

            parts = UIFunction.getNumberParts(numberString, localeInfo, options, isNormalized);
        } catch (error) {
            // failed to get number parts with error
            parts = null;
        }
        return parts?.valueString || `${value}`;
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
    };

    changeLanguage = (language: Language) => {
        this.setLanguage(language);
        dayjs.locale(this.dayJSLocale);
    };

    formatTime = (time: number | Date, format: string = TIME_FORMAT): string => {
        return dayjs(time).format(format);
    };

    formatDate = (time: number | Date): string => {
        const today = new Date();
        const date = new Date(time);
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        const dateTime = date.getTime();
        const isToday = todayTime === dateTime;
        const isYesterday = todayTime - dateTime === 24 * 3600 * 1000;

        if (isToday) {
            return this.formatString(uiLocalized.TodayAt, this.formatTime(time));
        }

        if (isYesterday) {
            return this.formatString(uiLocalized.YesterdayAt, this.formatTime(time));
        }

        return dayjs(time).format(`D MMM ${TIME_FORMAT}`);
    };

    formatDateOnly = (date: number | Date): string => {
        return dayjs(date).format(`D MMM`);
    };

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
        if (this.languages.includes(language as Language)) {
            return language as Language;
        }

        const [lang]: Language[] = this.getInterfaceLanguage().split('-');

        if (this.languages.includes(lang)) {
            return lang;
        }

        return Language.En;
    }

    getFirstDayOfWeek = (): number => {
        return this.localeInfo.dates.dayOfWeek || 1;
    };

    shortenAmount: ShortenAmount = shortenAmount.bind(this, this.ShortenedNumberSuffix);
}

export const uiLocalized: LocalizedInstance<UILocalizedData> =
    new LocalizationService<UILocalizedData>({ languages: preparedLanguages }) as any;

export const TIME_FORMAT = 'HH:mm';
