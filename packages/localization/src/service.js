// @flow
import dayjs from 'dayjs';
import LocalizedStrings from 'react-native-localization';
import BigNumber from 'bignumber.js';
import { UIConstant, UIFunction, UILocalizedService } from '@uikit/core';
import type { NumberParts, NumberPartsOptions } from '@uikit/core';

import * as UIKitLanguages from './languages';
import type { Language, Languages, LocalizedStringsMethods, StringLocaleInfo } from '../types';
import { getDateFormatInfo, getNumberFormatInfo } from './utils';
import type { UILocalizedData } from './languages/types';


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

    amountToLocale(
        number: BigNumber | string | number,
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

    changeLanguage = async (language: Language) => {
        this.setLanguage(language);
        dayjs.locale(language);
    };
}

// eslint-disable-next-line max-len
type LocalizedInstance = UILocalizedData & LocalizationService<UILocalizedData> & LocalizedStringsMethods

export const uiLocalized: LocalizedInstance = new UILocalizedService({ languages: UIKitLanguages });

