// @flow
import { StyleSheet } from 'react-native';

import type { UIColorData, UIColorThemeNameType } from '../UIColor/UIColorTypes';
import { UITheme } from '../UITheme';

type ColorStyle = string;

const colorStyleSheets: { [ColorStyle]: Object } = {
    color: {},
    backgroundColor: {},
    borderBottomColor: {},
    borderTopColor: {},
    tintColor: {},
};

export default class UIStyleColor {
    static styles = {
        color: 'color',
        backgroundColor: 'backgroundColor',
        borderBottomColor: 'borderBottomColor',
        borderTopColor: 'borderTopColor',
        tintColor: 'tintColor',
    };

    // Deprecated
    static Styles = {
        Color: 'color',
        BackgroundColor: 'backgroundColor',
        BorderBottomColor: 'borderBottomColor',
        TintColor: 'tintColor',
    };

    static getStyle(color: UIColorData, colorStyle: ColorStyle): Object {
        const colorStyles = colorStyleSheets[colorStyle];
        if (!colorStyles) {
            return null;
        }
        let sheet = colorStyles[color];
        if (!sheet) {
            sheet = StyleSheet.create({
                style: {
                    [colorStyle]: color,
                },
            });
            colorStyles[color] = sheet;
        }
        return sheet.style;
    }

    static getColorStyle(color: UIColorData) {
        return this.getStyle(color, this.styles.color);
    }

    static getBackgroundColorStyle(color: UIColorData) {
        return this.getStyle(color, this.styles.backgroundColor);
    }

    static getBorderBottomColorStyle(color: UIColorData) {
        return this.getStyle(color, this.styles.borderBottomColor);
    }

    static borderBottom(theme: ?UIColorThemeNameType, focused: boolean, hover: boolean) {
        const borderColor = UITheme.borderBottomColor(theme, focused, hover);
        return this.getBorderBottomColorStyle(borderColor);
    }
}
