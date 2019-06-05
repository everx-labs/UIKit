import { Platform } from 'react-native';
import { AsYouType, parsePhoneNumberFromString, parseDigits } from 'libphonenumber-js';
import CurrencyFormatter from 'currency-formatter';
import Moment from 'moment';
import isEmail from 'validator/lib/isEmail';

const currencies = require('currency-formatter/currencies.json');
const countries = require('../../assets/countries/countries.json');

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
            maximumFractionDigits: 8,
        },
    ) {
        return Number(number).toLocaleString(locale, options);
    }

    // Allows to print small numbers with "-e" suffix
    static getNumberString(number: number): string {
        return number.toFixed(10).replace(/\.?0+$/, '');
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

    static formatMessageDate(date, shortFormat = true) {
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

    static roundNumber(number, scale = 2) {
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

    static roundStringNumber(string, scale = 2) {
        const number = parseFloat(`${string}`.replace(',', '.'));
        return UIFunction.roundNumber(number, scale);
    }

    static alertObject(obj, level = 0) {
        if (typeof obj === 'string') {
            alert(obj);
            return;
        }

        const tab = UIFunction.repeat('   ', level);

        let str = '';
        for (const key in obj) {
            str += `${tab + key}: ${typeof obj[key] === 'object' ? `\r\n${UIFunction.alertObject(obj[key], level + 1)}` : obj[key]}\r\n`;
        }

        if (level === 0) {
            alert(str);
        } else {
            return str;
        }
    }

    static repeat(str, number) {
        let res = '';
        for (let i = 0; i < number; i += 1) {
            res += str;
        }
        return res;
    }

    static areObjectsEqual(objA, objB) {
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
            .replace(this.spaces, ' ')
            .trim()
            .toLowerCase();
    }

    static formatLowerLetters(str: string): string {
        const normalizedStr = UIFunction.normalizeKeyPhrase(str);
        return normalizedStr
            .replace(/[^\s-_0-9a-zA-Zа-яА-ЯёЁ]/g, '');
    }

    static hasLetters(str) {
        return str.search(/[a-zа-яё]/i) !== -1;
    }

    static isSameKeyPhrases(a: string, b: string): boolean {
        return this.normalizeKeyPhrase(a) === this.normalizeKeyPhrase(b);
    }

    static isEmail(expression: string) {
        return isEmail(expression);
    }

    static getCookie(name) {
        const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    static setCookie(key, value, days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        document.cookie = `${key}=${value}; path=/; expires=${date.toUTCString()}`;
    }
}
