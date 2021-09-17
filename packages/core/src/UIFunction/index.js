/* eslint-disable no-useless-escape, no-plusplus */
// @flow

import { Platform, Text, TextInput } from 'react-native';
import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { AsYouType, parsePhoneNumberFromString, parseDigits } from 'libphonenumber-js';
import CurrencyFormatter from 'currency-formatter';
import dayjs from 'dayjs';
import isEmail from 'validator/lib/isEmail';
import BigNumber from 'bignumber.js';
import currencies from 'currency-formatter/currencies.json';

import { UIAssets } from '@tonlabs/uikit.assets';

import UIConstant from '../UIConstant';
import type { BigNum } from '../types/BigNum';

export const CurrencyPosition = Object.freeze({
    Before: 'before',
    After: 'after',
});

export type CurrencyPositionType = $Values<typeof CurrencyPosition>;

type BankCardNumberArgs = {
    number: string,
    raw?: boolean,
    presumed?: boolean,
};

export type NumberParts = {
    value: BigNum,
    integer: string,
    decimal: string,
    valueString: string,
};

export type NumberPartsOptions = {
    minimumFractionDigits: number,
    maximumFractionDigits: number,
};

type NumberFormatInfo = {
    grouping: string,
    thousands: string,
    decimal: string,
    decimalGrouping: string,
};

// This stores the order of the date and the separator character
// for a locale configuration. i.e.  for the date: 07.06.1986
// the position for each part is: day = 0, month = 1, year = 2
// and the separator is: '.'
type DateFormatInfo = {
    separator: string,
    localePattern: string,
    components: string[],
};

type CurrencyInfo = {
    code: string,
    symbol: string,
    precision: number,
};

export type StringLocaleInfo = {
    name: string,
    numbers: NumberFormatInfo,
    dates: DateFormatInfo,
};

export default class UIFunction {
    // 'No operation' closure. Useful in case when callback/handler must be specified but
    // without real work.
    // Instead of <Component onEvent={() => {}} >
    // preferable way is: <Component onEvent={UIFunction.NOP} >
    static NOP = () => {};

    // Async Helpers
    /** Converts callback style function into Promise */
    static makeAsync(original: any): (...args: any) => Promise<any> {
        return (...args: any) => {
            return new Promise((resolve, reject) => {
                original(...args, (err, value) => {
                    return err ? reject(err) : resolve(value);
                });
            });
        };
    }

    /** Same as makeAsync, but callback args reversed: (value, err) */
    static makeAsyncRev(original: any): (...args: any) => Promise<any> {
        return (...args: any) => {
            return new Promise((resolve, reject) => {
                original(...args, (value, err) => {
                    return err ? reject(err) : resolve(value);
                });
            });
        };
    }

    // Process money conversion
    static numberFromMoneyString(
        string: string,
        currency: CurrencyInfo = {
            code: 'USD',
            symbol: '$',
            precision: 0,
        },
    ) {
        const options = {
            code: currency.code,
            symbol: currency.symbol,
            precision: currency.precision || 0,
            format: `%s${currencies[currency.code].spaceBetweenAmountAndSymbol ? ' ' : ''}%v`,
        };
        return CurrencyFormatter.unformat(string, options);
        // return Number((string || '0').replace(/[$,]/g, ''));
    }

    static moneyStringFromNumber(
        number: number,
        currency: CurrencyInfo = {
            code: 'USD',
            symbol: '$',
            precision: 0,
        },
    ) {
        const options = {
            code: currency.code,
            symbol: currency.symbol,
            precision: currency.precision || 0,
            format: `%s${currencies[currency.code].spaceBetweenAmountAndSymbol ? ' ' : ''}%v`,
        };
        return CurrencyFormatter.format(Number(number), options);
    }

    static toFixedDown(number: number | string, fixed: number = 2) {
        const reg = new RegExp(`(^-?\\d+\\.\\d{${fixed}})`);
        const match = number.toString().match(reg);
        return match ? match[0] : Number(number).toFixed(fixed);
    }

    // Functions to determine a new caret position for numeric formatted text !!!
    /**
     * @deprecated method to remove
     */
    static calculateNewCaretPosition(
        currentCaretPos: number,
        currentText: string,
        newText: string,
        /* currency: CurrencyInfo = {
            code: 'USD',
            symbol: '$',
            precision: 0,
        }, */
    ) {
        // const { precision } = currency;
        // const precisionBefore = Math.max(0, (currentCaretPos - currentText.length) + precision);
        // const currencyBefore = { ...currency, precision: precisionBefore };
        const textBeforeCurrentCaret = this.numericText(currentText.slice(0, currentCaretPos));
        let newCaretPos = 0;
        for (let i = 0; i < textBeforeCurrentCaret.length; i += 1) {
            const digit = textBeforeCurrentCaret.charAt(i);
            while (newCaretPos < newText.length) {
                const symbol = newText.charAt(newCaretPos);
                newCaretPos += 1;
                if (symbol === digit) {
                    break;
                }
            }
        }
        return newCaretPos;
    }

    // Returns a string that represents the formatted number using the locale configuration.
    static amountToLocale(
        number: number,
        locale: string,
        options: $Shape<Intl$NumberFormatOptions> = {
            minimumFractionDigits: 0,
            maximumFractionDigits: UIConstant.maxDecimalDigits(),
        },
    ) {
        return Number(number).toLocaleString(locale, options);
    }

    // Returns string of amount and currency in required order (default is
    static amountAndCurrency(
        amount: string,
        currency: string,
        currencyPosition: CurrencyPositionType = CurrencyPosition.Before,
    ) {
        return currencyPosition === CurrencyPosition.Before
            ? `${currency} ${amount}`
            : `${amount} ${currency}`;
    }

    // Allows to print small numbers with "-e" suffix
    static getNumberString(number: number | BigNum, digits: number = 10): string {
        // $FlowExpectedError
        if (!BigNumber.isBigNumber(number) && Math.abs(number) > 1) {
            // Apply BigNumber conversion only for non-small numbers!
            try {
                return new BigNumber(number.toString()).toString();
            } catch (error) {
                // Failed to convert the number to string with BigNumber instance
            }
        }
        return number.toFixed(digits).replace(/\.?0+$/, '');
    }

    //
    static normalizedAmount(s: ?string, localeInfo: StringLocaleInfo): ?string {
        if (s === undefined || s === null) {
            return null;
        }
        let normalized = UIFunction.replaceAll(`${s}`, ' ', '');
        const { grouping, thousands, decimal, decimalGrouping } = localeInfo.numbers;
        normalized = UIFunction.replaceAll(normalized, grouping, '');
        normalized = UIFunction.replaceAll(normalized, thousands, '');
        normalized = UIFunction.replaceAll(normalized, decimalGrouping, '');
        normalized = normalized.replace(decimal, '.');
        return normalized;
    }

    static replaceAll(s: string, search: string, replace: string): string {
        if (search === '') {
            return s;
        }
        return s.split(search).join(replace);
    }

    //
    static getNumberParts(
        value: string,
        localeInfo: StringLocaleInfo,
        options: NumberPartsOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 9,
        },
        isNormalized: boolean = false,
    ): ?NumberParts {
        // Normalize passed value
        const normalizedValue = isNormalized
            ? value
            : UIFunction.normalizedAmount(value, localeInfo);
        if (
            normalizedValue === undefined ||
            normalizedValue === null ||
            Number.isNaN(Number(normalizedValue))
        ) {
            // The string can't be parsed as a number
            return null;
        }
        // If the string contains more than one decimal separator return null.
        const defaultSeparator = '.';
        const splitParts = normalizedValue.split(defaultSeparator);
        // Two is the max number of parts
        if (splitParts.length > 2) {
            // The string can't be parsed as a number with more than one separator
            return null;
        }
        // Calculate and combine the result values into a single TONNumberParts object
        const result = {
            value: new BigNumber(0),
            integer: '0',
            decimal: '',
            valueString: '0',
        };
        // Fix value by rounding it from above
        const fixedValue =
            (splitParts[1]?.length || 0) > options.maximumFractionDigits
                ? UIFunction.toFixedDown(normalizedValue, options.maximumFractionDigits)
                : normalizedValue;
        // Remove unwanted leading zeros and trailing whitespaces
        const trimmedValue = fixedValue.replace(/^0+/, '').trim();
        const plainValue =
            !trimmedValue.length || trimmedValue.startsWith(defaultSeparator)
                ? `0${trimmedValue}`
                : trimmedValue;
        // Set resulted value
        result.value = new BigNumber(plainValue);
        // Find value components
        const components = plainValue.split(defaultSeparator);
        result.integer = components[0] || '0';
        result.decimal = components[1] || '';
        const trailingZerosToAdd = options.minimumFractionDigits - result.decimal.length;
        if (trailingZerosToAdd > 0) {
            result.decimal = `${result.decimal}${'0'.repeat(trailingZerosToAdd)}`;
        }
        // Localize value string
        const integerString = result.integer.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            localeInfo.numbers.thousands,
        );
        const separatorString =
            plainValue.indexOf(defaultSeparator) >= 0 || trailingZerosToAdd > 0
                ? localeInfo.numbers.decimal
                : '';
        const decimalString = result.decimal || '';
        const decFormatted =
            decimalString.match(/.{1,3}/g)?.join(localeInfo.numbers.decimalGrouping) || '';
        result.valueString = `${integerString}${separatorString}${decFormatted}`;
        // Return result
        return result;
    }

    static numericText(text: string) {
        return parseDigits(text);
    }

    static isPhoneNumber(expression: string) {
        const normalizedPhone = this.normalizePhone(expression);
        return this.isPhoneValid(normalizedPhone);
    }

    static isPhoneValid(phone: ?string) {
        let valid = false;
        try {
            const parseResult = parsePhoneNumberFromString(`+${phone || ''}`);
            valid = parseResult.isValid();
        } catch (exception) {
            console.log(
                `[UIFunction] Failed to parse phone code ${phone || ''} with exception`,
                exception,
            );
        }
        return valid;
    }

    static removeCallingCode(phone: string, callingCode: string) {
        if (callingCode) {
            // remove `+`, `countryCallingCode` and ` `
            if (phone.startsWith('+')) {
                return phone.substring(1 + callingCode.length).trim();
            }
        }
        return phone;
    }

    static formatPhoneText(
        text: string,
        removeCountryCode: boolean = false,
        cleanIfFailed: boolean = false,
    ) {
        // If validation for text is not there, the app crashes when sending
        // a profile without phone number to UserInfoScreen.
        let phone = text ? `+${this.numericText(text)}` : '';
        try {
            const parsedPhone = parsePhoneNumberFromString(phone);
            phone = parsedPhone.formatInternational();
            if (removeCountryCode) {
                phone = this.removeCallingCode(phone, parsedPhone.countryCallingCode);
            }
        } catch (exception) {
            console.log(`[UIFunction] Failed to parse phone ${phone} with exception`, exception);
            if (cleanIfFailed) {
                phone = '';
            }
        }
        return phone;
    }

    // Used for phone formatting without country code
    // In this case we should know the country
    static formatPhoneInput(input: string, country: Object) {
        let phone = this.numericText(input);
        try {
            const asYouType = new AsYouType(country.iso);
            phone = asYouType.input(`+${country.callingCode}${input}`);
            phone = this.removeCallingCode(phone, country.callingCode);
        } catch (exception) {
            console.log(`[UIFunction] Failed to parse phone ${phone} with exception`, exception);
        }
        return phone;
    }

    // This keyboard types are the best for the phone formatting on different platforms
    static phoneNumberInputKeyboardType() {
        if (Platform.OS === 'web') {
            return 'default';
        }
        return 'phone-pad';
    }

    // Detects country of the phone
    static countryISOFromPhone(phone: string) {
        let countryCode = null;
        try {
            const parsedResult = parsePhoneNumberFromString(`+${phone}`);
            if (parsedResult.country) {
                countryCode = parsedResult.country;
            } else if (parsedResult.countryCallingCode) {
                const countryList = Object.keys(UIAssets.countries);
                for (let i = 0; i < countryList.length; i += 1) {
                    const countryISO = countryList[i];
                    const country = UIAssets.countries[countryISO];
                    if (country.phone.split(',')[0] === parsedResult.countryCallingCode) {
                        countryCode = countryISO;
                        break;
                    }
                }
            }
        } catch (exception) {
            console.log(
                `[UIFunction] Failed to parse phone code ${phone} with exception`,
                exception,
            );
        }
        return countryCode;
    }

    // International phone
    static normalizePhone(phone: string): string {
        const internationalPhone = this.internationalPhone(phone);
        if (!internationalPhone) {
            return this.numericText(phone);
        }
        return this.numericText(internationalPhone);
    }

    static internationalPhone(phone: string): ?string {
        if (!phone) {
            return null;
        }
        const phoneNumber = this.numericText(phone);
        let parsedPhone = parsePhoneNumberFromString(`+${phoneNumber}`);
        if (!parsedPhone || !parsedPhone.isValid()) {
            parsedPhone = parsePhoneNumberFromString(phoneNumber, 'RU'); // parse 8 prefixed phones
        }
        if (!parsedPhone || !parsedPhone.isValid()) {
            parsedPhone = parsePhoneNumberFromString(phoneNumber, 'US'); // parse the rest
        }
        if (!parsedPhone) {
            return null;
        }
        return parsedPhone.formatInternational();
    }

    static formatMessageDate(date: Date, shortFormat: boolean = true) {
        const format = shortFormat ? 'l' : 'll';
        return dayjs(date).calendar(null, {
            sameDay: 'LT',
            nextDay: 'ddd',
            lastDay: 'ddd',
            nextWeek: 'ddd',
            lastWeek: 'ddd',
            sameElse: format,
        });
    }

    static roundNumber(number: number, scale: number = 2) {
        if (!`${number}`.includes('e')) {
            // $FlowExpectedError
            return +`${Math.round(`${number}e+${scale}`)}e-${scale}`;
        }
        const arr = `${number}`.split('e');
        let sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        // $FlowExpectedError
        return +`${Math.round(`${+arr[0]}e${sig}${+arr[1] + scale}`)}e-${scale}`;
    }

    static roundStringNumber(str: string, scale: number = 2) {
        const number = parseFloat(`${str}`.replace(',', '.'));
        return UIFunction.roundNumber(number, scale);
    }

    static objectToString(obj: any, level: number = 0) {
        if (typeof obj === 'string') {
            return obj;
        }

        const tab = UIFunction.repeat('   ', level);

        let str = '';
        Object.keys(obj).forEach(key => {
            str += `${tab + key}: ${
                typeof obj[key] === 'object'
                    ? `\r\n${UIFunction.objectToString(obj[key], level + 1)}`
                    : obj[key]
            }\r\n`;
        });

        return str;
    }

    static repeat(str: string, num: number) {
        let res = '';
        for (let i = 0; i < num; i += 1) {
            res += str;
        }
        return res;
    }

    static areObjectsEqual(objA: { [string]: string }, objB: { [string]: string }) {
        if (!objA || !objB) {
            return false;
        }

        const aProps = Object.getOwnPropertyNames(objA);
        const bProps = Object.getOwnPropertyNames(objB);

        if (aProps.length !== bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i += 1) {
            const propName = aProps[i];

            const itemA = objA[propName];
            const itemB = objB[propName];
            if (itemA instanceof Object && itemB instanceof Object) {
                if (!this.areObjectsEqual(itemA, itemB)) {
                    return false;
                }
            } else if (itemA !== itemB) {
                return false;
            }
        }

        return true;
    }

    static splitRandomly(s: string, limits: number[][]): string[] {
        let pos = 0;
        let limit = 0;
        const parts = [];
        while (pos < s.length) {
            const [min, max] = limits[limit];
            const minPos = Math.min(pos + min, s.length);
            const maxPos = Math.min(pos + max, s.length);
            const next = minPos + Math.round(Math.random() * (maxPos - minPos));
            if (next > pos) {
                parts.push(s.substring(pos, next));
            }
            pos = next;
            limit += 1;
            if (limit >= limits.length) {
                limit = 0;
            }
        }
        return parts;
    }

    static spaces = /\s+/g;

    static normalizeKeyPhrase(keyPhrase: string): string {
        return keyPhrase
            .replace(new RegExp(UIConstant.dashSymbol(), 'g'), '')
            .replace(this.spaces, ' ')
            .trim()
            .toLowerCase();
    }

    static formatLowerLetters(str: string): string {
        const normalizedStr = UIFunction.normalizeKeyPhrase(str);
        return normalizedStr.replace(/[^\s-_0-9a-zA-Zа-яА-ЯёЁ]/g, '');
    }

    static hasLetters(str: string) {
        return str.search(/[a-zа-яё]/i) !== -1;
    }

    static isSameKeyPhrases(a: string, b: string): boolean {
        return this.normalizeKeyPhrase(a) === this.normalizeKeyPhrase(b);
    }

    static isEmail(expression: string) {
        return isEmail(expression);
    }

    static getCookie(name: string) {
        // $FlowExpectedError
        const matches = document.cookie.match(
            new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`),
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    static setCookie(key: string, value: string, days: number) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        document.cookie = `${key}=${value}; path=/; expires=${date.toUTCString()}; SameSite=None; Secure`;
    }

    static bankCardTypes = {
        masterCard: 'masterCard',
        maestro: 'maestro',
        visa: 'visa',
        amex: 'amex',
        undetected: 'undetected',
    };

    // TODO: Probably it would be better to use a library that already verifies this, or find
    // a simpler approach, plus add unit tests for different bank cards
    static getBankCardType({
        number = '',
        raw = true,
        presumed = false,
    }: BankCardNumberArgs): { [string]: boolean } | ?string {
        const rawNumber = raw ? number : number.replace(/[^0-9]/gim, '');
        const regEx = {
            [this.bankCardTypes.visa]: /^4[0-9]{12}(?:[0-9]{3})?$/,
            [this.bankCardTypes.masterCard]:
                /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
            [this.bankCardTypes.maestro]: /^(5[06789]|6)[0-9]*$/,
            [this.bankCardTypes.amex]: /^3[47][0-9]{13}$/,
            // for future using
            // amex: /^3[47][0-9]{13}$/,
            // diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            // discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            // jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
            // dankort: /^(5019)\d+$/,
            // interpayment: /^(636)\d+$/,
            // unionpay: /^(62|88)\d+$/,
            // electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        };

        const numbers = {
            [this.bankCardTypes.visa]: '4916338506082832',
            [this.bankCardTypes.masterCard]: '5280934283171080',
            [this.bankCardTypes.maestro]: '5018000000000000000',
            [this.bankCardTypes.amex]: '370000000000000',
        };

        const results = {};
        Object.keys(regEx).forEach(key => {
            const fullNumber = presumed
                ? `${rawNumber}${numbers[key].substr(rawNumber.length)}`
                : rawNumber;
            if (
                regEx[key].test(fullNumber) &&
                (presumed ||
                    rawNumber.length === 15 || // For American Express
                    presumed ||
                    rawNumber.length === 16 || // Almost all cards
                    presumed ||
                    rawNumber.length === 19) // For some Maestro cards
            ) {
                results[key] = true;
            }
        });

        if (presumed) {
            return results;
        }
        const arr = Object.keys(results).map(key => key);
        if (arr.length) {
            return arr[0];
        }
        if (rawNumber.length >= 14 && rawNumber.length <= 19) {
            return this.bankCardTypes.undetected;
        }
        return null;
    }

    // for numeric inputs that can be formatted with different separators
    static adjustCursorPosition2(prevText: string, currentText: string): number {
        let idx = 0;
        let idxF = 0;

        const digits = '0123456789';
        const a = prevText.replace(/\D/g, '');
        const b = currentText.replace(/\D/g, '');

        while (idx < b.length && idx < a.length) {
            if (a[idx] !== b[idx]) {
                break;
            }
            idx++;
        }

        idx = b.length > a.length ? idx + 1 : idx;
        let i = 0;
        do {
            while (idxF < currentText.length && !digits.includes(currentText[idxF])) {
                idxF++;
            }
            idxF++;
            i++;
        } while (i < idx);

        return idxF;
    }

    static adjustCursorPosition(
        textSource: string,
        cursorSource: number,
        textFormatted: string,
    ): number {
        const digits = '0123456789';
        const cursorInDigits =
            cursorSource -
            textSource.split('').filter((s, r) => !digits.includes(s) && r < cursorSource).length;

        let idx = 0;
        let cursorFormatted = 0;

        for (let i = 0; i < textFormatted.length; ++i) {
            if (digits.includes(textFormatted[i])) {
                if (idx < cursorInDigits) {
                    ++cursorFormatted;
                    ++idx;
                }
                if (idx === cursorInDigits) break;
            } else {
                ++cursorFormatted;
            }
        }
        return cursorFormatted;
    }

    static combineStyles(stylesArray: (ViewStyleProp | TextStyleProp)[]) {
        let result = [];
        stylesArray.forEach(item => {
            result = Array.isArray(item) ? [...result, ...item] : [...result, item];
        });
        return result;
    }

    static roundToMeaningDigit(num: number): number {
        const fraction = num - Math.trunc(num);
        for (let i = 0; i < 10; i += 1) {
            if (fraction * 10 ** i >= 1) {
                return Math.trunc(num) + Number(fraction.toFixed(i));
            }
        }
        return num;
    }

    static truncText(str: string, narrow: boolean, signsCount?: number) {
        if (!str) {
            return '';
        }

        const signs = signsCount || (narrow ? 5 : 9);
        if (str.length <= signs * 2) {
            return str;
        }
        return `${str.substr(0, signs)} ... ${str.substr(str.length - signs)}`;
    }

    // Return flat object, takes complex object with enclosures as an argument
    static flatify(obj: any) {
        if (!obj) return {};

        const result = {};
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                const flattifyResult = this.flatify(obj[key]);
                Object.keys(flattifyResult).forEach(innerKey => {
                    result[`${key} / ${innerKey}`] = flattifyResult[innerKey];
                });
            } else {
                result[key] = obj[key];
            }
        });

        return result;
    }

    static capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    static isNil(arg: any): boolean {
        return arg == null;
    }

    static toFixedOrEmpty(arg: ?number, fractionDigits: number): string {
        return arg == null ? '' : arg === 0 ? '0' : arg.toFixed(fractionDigits);
    }

    /**
     * Disable font scaling by default for Text and TextInput components
     */
    static disableScaling() {
        // $FlowFixMe
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        // $FlowFixMe
        TextInput.defaultProps = TextInput.defaultProps || {};
        TextInput.defaultProps.allowFontScaling = false;
    }

    static remove0x(str: string = ''): string {
        return str.slice(0, 2) === '0x' ? str.slice(2) : str;
    }

    static formatHex(str: string = ''): string {
        return this.remove0x(str).padStart(64, '0');
    }

    static summarizeByKey(arr: any[], key: string): number {
        return arr.reduce((prev, curr) => prev + curr[key], 0);
    }
}
