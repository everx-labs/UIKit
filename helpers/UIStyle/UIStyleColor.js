// @flow
import { StyleSheet } from 'react-native';

import UIColor from '../UIColor';
import type { UIColorData, UIColorThemeNameType } from '../UIColor/UIColorTypes';

type ColorStyle = 'color' | 'backgroundColor' | 'borderBottomColor' | 'borderTopColor' | 'tintColor';

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

    static getStyle(color: UIColorData, colorStyle: ColorStyle) {
        const colorStyles = colorStyleSheets[colorStyle];
        if (!colorStyles) {
            return null;
        }
        let sheet = colorStyles[color];
        if (!sheet) {
            sheet = StyleSheet.create({
                style: {
                    // $FlowFixMe
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

    static getBorderTopColorStyle(color: UIColorData) {
        return this.getStyle(color, this.styles.borderTopColor);
    }

    static getTintColorStyle(color: UIColorData) {
        return this.getStyle(color, this.styles.tintColor);
    }

    static textPrimary(theme?: ?UIColorThemeNameType) {
        return this.getColorStyle(UIColor.textPrimary(theme));
    }

    static stateTextPrimary(
        theme: ?UIColorThemeNameType,
        disabled: boolean,
        tapped: boolean,
        hover: boolean,
    ) {
        const color = UIColor.stateTextPrimary(theme, disabled, tapped, hover);
        return this.getColorStyle(color);
    }

    static actionTextPrimary(theme?: ?UIColorThemeNameType) {
        return this.getColorStyle(UIColor.actionTextPrimary(theme));
    }

    static textSecondary(theme?: ?UIColorThemeNameType) {
        return this.getColorStyle(UIColor.textSecondary(theme));
    }

    static textTertiary(theme?: ?UIColorThemeNameType) {
        return this.getColorStyle(UIColor.textTertiary(theme));
    }

    static borderBottomLight(theme: ?UIColorThemeNameType) {
        const borderColor = UIColor.borderBottomLightColor(theme);
        return this.getBorderBottomColorStyle(borderColor);
    }

    static borderBottom(
        theme: ?UIColorThemeNameType,
        focused: boolean,
        hover: boolean,
    ) {
        const borderColor = UIColor.borderBottomColor(theme, focused, hover);
        return this.getBorderBottomColorStyle(borderColor);
    }
}
