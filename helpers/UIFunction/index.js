import { Platform } from 'react-native';
import { AsYouType, parsePhoneNumberFromString, parseDigits } from 'libphonenumber-js';
import CurrencyFormatter from 'currency-formatter';
import Moment from 'moment';
import isEmail from 'validator/lib/isEmail';

import UIConstant from '../../helpers/UIConstant';
import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

const currencies = require('currency-formatter/currencies.json');
const countries = require('../../assets/countries/countries.json');

export const CurrencyPosition = Object.freeze({
    Before: 'before',
    After: 'after',
});

export type CurrencyPositionType = $Values<typeof CurrencyPosition>;

type BankCardNumberArgs = {
    number: string,
    raw?: boolean,
    presumed?: boolean,
}

export default class UIFunction {
    // 'No operation' closure. Useful in case when callback/handler must be specified but
    // without real work.
    // Instead of <Component onEvent={() => {}} >
    // preferable way is: <Component onEvent={UIFunction.NOP} >
    static NOP = () => {
    };

    // Async Helpers
    /** Converts callback style function into Promise */
    static makeAsync(original) {
        return (...args) => {
            return new Promise((resolve, reject) => {
                original(...args, (err, value) => {
                    return err ? reject(err) : resolve(value);
                });
            });
        };
    }

    /** Same as makeAsync, but callback args reversed: (value, err) */
    static makeAsyncRev(original) {
        return (...args) => {
            return new Promise((resolve, reject) => {
                original(...args, (value, err) => {
                    return err ? reject(err) : resolve(value);
                });
            });
        };
    }


    // Process money convertion
    static numberFromMoneyString(string, currency = {
        code: 'USD',
        symbol: '$',
        precision: 0,
    }) {
        const options = {
            code: currency.code,
            symbol: currency.symbol,
            precision: currency.precision || 0,
            format: `%s${currencies[currency.code].spaceBetweenAmountAndSymbol ? ' ' : ''}%v`,
        };
        return CurrencyFormatter.unformat(string, options);
        // return Number((string || '0').replace(/[$,]/g, ''));
    }

    static moneyStringFromNumber(number, currency = {
        code: 'USD',
        symbol: '$',
        precision: 0,
    }) {
        const options = {
            code: currency.code,
            symbol: currency.symbol,
            precision: currency.precision || 0,
            format: `%s${currencies[currency.code].spaceBetweenAmountAndSymbol ? ' ' : ''}%v`,
        };
        return CurrencyFormatter.format(Number(number), options);
    }

    static toFixedDown(number, fixed = 2) {
        const reg = new RegExp(`(^-?\\d+\\.\\d{${fixed}})`);
        const match = number.toString().match(reg);
        return match ? match[0] : Number(number).toFixed(fixed);
    }

    // Functions to determine a new caret position for numeric formatted text !!!
    static calculateNewCaretPosition(
        currentCaretPos, currentText, newText,
        currency = {
            code: 'USD',
            symbol: '$',
            precision: 0,
        },
    ) {
        const { precision } = currency;
        const precisionBefore = Math.max(0, (currentCaretPos - currentText.length) + precision);
        const textBeforeCurrentCaret
            = this.numericText(
                currentText.slice(0, currentCaretPos),
                {
                    ...currency,
                    precision: precisionBefore,
                },
            );
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
        number,
        locale,
        options = {
            minimumFractionDigits: 0,
            maximumFractionDigits: UIConstant.maxDecimalDigits(),
        },
    ) {
        return Number(number).toLocaleString(locale, options);
    }

    // Returns string of amount and currency in required order (default is
    static amountAndCurrency(
        amount,
        currency,
        currencyPosition: CurrencyPositionType = CurrencyPosition.Before,
    ) {
        return currencyPosition === CurrencyPosition.Before
            ? `${currency} ${amount}`
            : `${amount} ${currency}`;
    }

    // Allows to print small numbers with "-e" suffix
    static getNumberString(number: number, digits: number = 10): string {
        return number.toFixed(digits).replace(/\.?0+$/, '');
    }

    static numericText(text) {
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
            console.log(`[UIFunction] Failed to parse phone code ${phone || ''} with exception`, exception);
        }
        return valid;
    }

    static removeCallingCode(phone, callingCode) {
        if (callingCode) {
            // remove `+`, `countryCallingCode` and ` `
            if (phone.startsWith('+')) {
                return phone.substring(1 + callingCode.length).trim();
            }
        }
        return phone;
    }

    static formatPhoneText(text, removeCountryCode = false, cleanIfFailed = false) {
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
            console.log(
                `[UIFunction] Failed to parse phone ${phone} with exception`,
                exception,
            );
            if (cleanIfFailed) {
                phone = '';
            }
        }
        return phone;
    }

    // Used for phone formatting without country code
    // In this case we should know the country
    static formatPhoneInput(input, country) {
        let phone = this.numericText(input);
        try {
            const asYouType = new AsYouType(country.iso);
            phone = asYouType.input(`+${country.callingCode}${input}`);
            phone = this.removeCallingCode(phone, country.callingCode);
        } catch (exception) {
            console.log(`[UIFunction] Failed to parse phone ${phone} with excepetion`, exception);
        }
        return phone;
    }

    // This keyboard types are the best for the phone formatting on different platforms
    static phoneNumberInputKeyboardType() {
        if (Platform.OS === 'web') {
            return 'default';
        } else if (Platform.OS === 'ios') {
            return 'number-pad';
        }
        return 'numeric';
    }

    // Detects country of the phone
    static countryISOFromPhone(phone) {
        let countryCode = null;
        try {
            const parsedResult = parsePhoneNumberFromString(`+${phone}`);
            if (parsedResult.country) {
                countryCode = parsedResult.country;
            } else if (parsedResult.countryCallingCode) {
                const countryList = Object.keys(countries);
                for (let i = 0; i < countryList.length; i += 1) {
                    const countryISO = countryList[i];
                    const country = countries[countryISO];
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
        // Same as Telegram formatting
        return Moment(date).calendar(null, {
            sameDay: 'LT',
            nextDay: 'ddd',
            lastDay: 'ddd',
            nextWeek: 'ddd',
            lastWeek: 'ddd',
            sameElse: format,
        });
    }

    static roundNumber(number: number, scale: number = 2) {
        if (!(`${number}`).includes('e')) {
            return +(`${Math.round(`${number}e+${scale}`)}e-${scale}`);
        }
        const arr = (`${number}`).split('e');
        let sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(`${Math.round(`${+arr[0]}e${sig}${+arr[1] + scale}`)}e-${scale}`);
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
        Object.keys(obj).forEach((key) => {
            str += `${tab + key}: ${typeof obj[key] === 'object' ? `\r\n${UIFunction.objectToString(obj[key], level + 1)}` : obj[key]}\r\n`;
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

    static splitRandomly(s: string, limits: (number[])[]): string[] {
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
        return normalizedStr
            .replace(/[^\s-_0-9a-zA-Zа-яА-ЯёЁ]/g, '');
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
        const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`));
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

    // TODO: Probably it would be better to use a library that already verifies this, or find a simpler
    //       approach, plus add unit tests for different bank cards
    static getBankCardType({ number = '', raw = true, presumed = false }: BankCardNumberArgs) {
        const rawNumber = raw ? number : number.replace(/[^0-9]/gim, '');
        const regEx = {
            [this.bankCardTypes.visa]: /^4[0-9]{12}(?:[0-9]{3})?$/,
            [this.bankCardTypes.masterCard]: /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
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
        Object.keys(regEx).forEach((key) => {
            const fullNumber = presumed ? `${rawNumber}${numbers[key].substr(rawNumber.length)}` : rawNumber;
            if (regEx[key].test(fullNumber)
            && (
                (presumed || rawNumber.length === 15) // For American Express
                || (presumed || rawNumber.length === 16) // Almost all cards
                || (presumed || rawNumber.length === 19) // For some Maestro cards
            )
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
    static adjustCursorPosition(textSource: string, cursorSource: number, textFormatted: string): number {
        const digits = '0123456789';
        const cursorInDigits = cursorSource - textSource.split('').filter((s, r) => !digits.includes(s) && r < cursorSource).length;

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

    static combineStyles(stylesArray: ViewStyleProp | ViewStyleProp[] | TextStyleProp | TextStyleProp[]) {
        let result = [];
        stylesArray.forEach((item) => {
            result = Array.isArray(item)
                ? [...result, ...item]
                : [...result, item];
        });
        return result;
    }

    static roundToMeaningDigit(num: number) {
        const fraction = num - Math.trunc(num);
        for (let i = 0; i < 10; i += 1) {
            if (fraction * (10 ** i) >= 1) {
                return Math.trunc(num) + Number(fraction.toFixed(i));
            }
        }
        return num;
    }

    static truncText(str: string, narrow: boolean, signsCount: number) {
        if (!str) {
            return '';
        }

        const signs = signsCount || (narrow ? 5 : 9);
        if (str.length <= signs * 2) {
            return str;
        }
        const dots = '.'.repeat(signs);
        return `${str.substr(0, signs)} ${dots} ${str.substr(str.length - signs)}`;
    }

    // Return flat object, takes complex object with enclosures as an argument
    static flatify(obj: any) {
        if (!obj) return {};

        const result = {};
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'object') {
                const flattifyResult = this.flatify(obj[key]);
                Object.keys(flattifyResult).forEach((innerKey) => {
                    result[`${key} / ${innerKey}`] = flattifyResult[innerKey];
                });
            } else {
                result[key] = obj[key];
            }
        });

        return result;
    }
}
