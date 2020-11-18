// @flow
import BigNumber from 'bignumber.js';

import type { NumberPartsOptions } from '@uikit/core';

import { languagesInfo } from '../src/constants';

export type Language = $Keys<typeof languagesInfo>;
export type Languages<T> = { [Language]: T }

export type LanguageInfo = {
    name: string,
    country: string, // Works with UICountryPicker
    dayJS: string, // Works with DayJS
}

export interface LanguageOptions {
    constants?: { [string]: string },
    images?: { [string]: any },
}

export type LanguageConstants = {
    [string]: any,
}

export type NumberFormatInfo = {
    grouping: string,
    thousands: string,
    decimal: string,
    decimalGrouping: string,
};

// This stores the order of the date and the separator character
// for a locale configuration. i.e.  for the date: 07.06.1986
// the position for each part is: day = 0, month = 1, year = 2
// and the separator is: '.'
export type DateFormatInfo = {
    separator: string,
    localePattern: string,
    components: string[],
};

export type StringLocaleInfo = {
    name: string,
    numbers: NumberFormatInfo,
    dates: DateFormatInfo,
};

export type LocalizedStringsMethods = {
    setLanguage(language?: string): void,
    getInterfaceLanguage(): string,
    getAvailableLanguages(): string[],
    formatString(str: string, ...values: any[]): string,
    getString(key: string, language: string): string | null,
    getLanguage(): string,
    getLanguageFromString(language: string): Language,
    amountToLocale(number: BigNumber | string | number, options?: NumberPartsOptions): string,
    localizedStringForValue(value: number, base: string): string,

    changeLocaleInfo: (localeInfo: StringLocaleInfo) => void,
    changeLanguage: (language: Language) => void,
    setLanguages: (languages: Language[]) => void,
    formatTime: (time: number, format?: string) => string,
    formatDate: (time: number) => string,

    decimalSeparator: string,
    languageName: string,
    dayJSLocale: string,
};
