import { Platform } from 'react-native';
import { AsYouType, formatNumber, parseNumber } from 'libphonenumber-js';
import CurrencyFormatter from 'currency-formatter';
import Moment from 'moment';

const currencies = require('currency-formatter/currencies.json');

const countries = require('../../components/UIAssets/countries/countries.json');

export default class UIFunction {
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
        return match ? match[0] : number.toFixed(fixed);
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

    // Used for numeric money representation as well may be used for exporting digits from phones
    static numericText(text, currency = {
        code: 'USD',
        symbol: '$',
        precision: 0,
    }) {
        const separator = currencies[currency.code].decimalSeparator;
        const number = text.trim();
        const split = number.split(separator);
        const integer = split[0].replace(/\D/g, '');
        if (split.length < 2) {
            return integer;
        }
        const quotient = (split[1] || '').substring(0, currency.precision);
        return `${integer}${separator}${quotient}`;
    }

    static isPhoneValid(phone) {
        let valid = false;
        try {
            const parseResult = parseNumber(`+${phone}`, { extended: true });
            ({ valid } = parseResult);
        } catch (exception) {
            console.log(`[UIFunction] Failed to parse phone code ${phone} with excepetion`, exception);
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
            const parsedPhone
                = parseNumber(phone, { extended: true });
            phone = formatNumber(parsedPhone, 'International');
            if (removeCountryCode) {
                phone = this.removeCallingCode(phone, parsedPhone.countryCallingCode);
            }
        } catch (exception) {
            console.log(`[UIFunction] Failed to parse phone ${phone} with excepetion`, exception);
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
            const parsedResult = parseNumber(`+${phone}`, { extended: true });
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
            console.log(`[UIFunction] Failed to parse phone code ${phone} with excepetion`, exception);
        }
        return countryCode;
    }

    // International phone
    static internationalPhone(phone) {
        let parsedPhone = parseNumber(phone, 'RU'); // It parses 8 (000) kind of phones
        if (Object.keys(parsedPhone).length === 0) {
            parsedPhone = parseNumber(phone, 'US'); // It parses all the rest mobile phones
        }
        if (Object.keys(parsedPhone).length === 0) {
            console.log('[UIFunction] Failed to parse phone:', phone); // Usually short phones
            return null;
        }
        const internationalPhone = formatNumber(parsedPhone, 'International');
        return UIFunction.numericText(internationalPhone);
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
        for (key in obj) {
            str += `${tab + key}: ${typeof obj[key] === 'object' ? `\r\n${UIFunction.alertObject(obj[key], level + 1)}` : obj[key]}\r\n`;
            // console.log(str);
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
            if ((itemA instanceof Object && itemB instanceof Object
                && !this.areObjectsEqual(itemA, itemB))
                || itemA !== itemB) {
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

    static isSameKeyPhrases(a: string, b: string): boolean {
        return this.normalizeKeyPhrase(a) === this.normalizeKeyPhrase(b);
    }
}

