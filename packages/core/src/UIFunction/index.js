/* eslint-disable no-useless-escape, no-plusplus */
// @flow

import { Text, TextInput } from 'react-native';
import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { parseDigits, parsePhoneNumberFromString } from 'libphonenumber-js';
import BigNumber from 'bignumber.js';

import type { BigNum } from '../types/BigNum';

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

export type StringLocaleInfo = {
    name: string,
    numbers: NumberFormatInfo,
    dates: DateFormatInfo,
};

export default class UIFunction {
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

    static toFixedDown(number: number | string, fixed: number = 2) {
        const reg = new RegExp(`(^-?\\d+\\.\\d{${fixed}})`);
        const match = number.toString().match(reg);
        return match ? match[0] : Number(number).toFixed(fixed);
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
        let phone = text ? `+${parseDigits(text)}` : '';
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

    static combineStyles(stylesArray: (ViewStyleProp | TextStyleProp)[]) {
        let result = [];
        stylesArray.forEach(item => {
            result = Array.isArray(item) ? [...result, ...item] : [...result, item];
        });
        return result;
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
}
