// @flow
import UITextStyle from '.';

export default class UIStyleText {
    static alignCenter() {
        return UITextStyle.alignCenter;
    }

    static bold() {
        return UITextStyle.bold;
    }

    static medium() {
        return UITextStyle.medium;
    }

    // [Colors]
    static primary() {
        // eslint-disable-next-line import/no-named-as-default-member
        return UITextStyle.primary;
    }

    static secondary() {
        return UITextStyle.secondary;
    }

    static tertiary() {
        return UITextStyle.tertiary;
    }

    static action() {
        return UITextStyle.action;
    }

    static error() {
        return UITextStyle.error;
    }

    static success() {
        return UITextStyle.success;
    }

    // [Text]
    // Title - fontSize: 36, lineHeight: 48
    static titleLight() {
        return UITextStyle.titleLight;
    }

    // Tiny - fontSize: 12, lineHeight: 16
    static tinyRegular() {
        return UITextStyle.tinyRegular;
    }
}
