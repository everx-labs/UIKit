import type BigNumber from 'bignumber.js';

import type { LocalizedStringsMethods } from 'react-native-localization';

import type { LocalizationString } from '../LocalizationString';
import type { Language } from '../language';

declare global {
    interface String {
        path?: string;
    }
}

export type LanguageSimpleValue =
    | LocalizationString
    | LocalizationString[]
    | string[]
    | string
    | boolean;
export type LanguageValue<T = LanguageSimpleValue> = Record<string, T> | Record<string, T>[] | T;
export type LanguageItem<T = LanguageValue> = Record<string, T>;

export interface LanguageOptions {
    constants?: Record<string, string>;
    images?: Record<string, string>;
    useExtendedString?: boolean;
}

export type Languages<T = LanguageItem> = Partial<Record<Language, T>>;
export type LanguagesOptions = Languages<LanguageOptions>;

export type LanguageConstants = Record<string, any>;

export type NumberFormatInfo = {
    grouping: string;
    thousands: string;
    decimal: string;
    decimalGrouping: string;
    decimalAlternative: string[];
};

export type NumberParts = {
    value: BigNumber;
    integer: string;
    decimal: string;
    valueString: string;
};

export type NumberPartsOptions = {
    minimumFractionDigits: number;
    maximumFractionDigits: number;
};

// This stores the order of the date and the separator character
// for a locale configuration. i.e.  for the date: 07.06.1986
// the position for each part is: day = 0, month = 1, year = 2
// and the separator is: '.'
export type DateFormatInfo = {
    separator: string;
    localePattern: string;
    components: string[];
    dayOfWeek: number;
};

export type StringLocaleInfo = {
    name: string;
    numbers: NumberFormatInfo;
    dates: DateFormatInfo;
};

export type LocalizationServiceMethods = Omit<LocalizedStringsMethods, 'formatString'> & {
    languages: Language[];
    localeInfo: StringLocaleInfo;
    formatString(str: string, ...values: string[]): string;
    setLanguages(languages: Language[]): void;
    amountToLocale(
        value: BigNumber | string | number | unknown,
        options?: NumberPartsOptions,
        localeInfo?: StringLocaleInfo,
    ): string;
    localizedStringForValue(value: number, base: string): string;
    changeLocaleInfo(localeInfo: StringLocaleInfo): void;
    changeLanguage(language: Language): void;
    formatTime(time: number | Date, format?: string): string;
    formatDate(time: number | Date): string;
    formatDateOnly(date: number | Date): string;
    getFirstDayOfWeek(): number;
    decimalSeparator: string;
    languageName: string;
    dayJSLocale: string;
    getLanguageFromString(language: string): Language;
};

export type LanguageInfo = {
    name: string;
    country: string; // Works with UICountryPicker
    dayJS: string; // Works with DayJS
};

export type ShortenAmountSettings = {
    /** The number of digits in the fractional part of the number */
    fractionalDigits?: number | undefined;
    /**
     * Is it necessary to localize amount?
     * By default is `true`
     */
    isLocalized?: boolean;
};

export type ShortenedNumberSuffix =
    | '3'
    | '6'
    | '9'
    | '12'
    | '15'
    | '18'
    | '21'
    | '24'
    | '27'
    | '30';

export type ShortenedNumberSuffixLocalization = {
    [key in ShortenedNumberSuffix]: string;
};

export type ShortenAmount = (
    value: number | BigNumber | null,
    settings?: ShortenAmountSettings,
) => string;

export type ShortenedAmountAttributes = {
    value: string;
    suffix: string;
};
