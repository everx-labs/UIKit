import { StyleSheet } from 'react-native';
import UIColor from '../UIColor';
import type { UIColorData, UIColorThemeNameType } from '../UIColor/UIColorTypes';

const colorStyleSheets = {
    color: {},
    backgroundColor: {},
    borderBottomColor: {},
    tintColor: {},
};

export default class UIStyleColor {
    static Styles = {
        Color: 'color',
        BackgroundColor: 'backgroundColor',
        BorderBottomColor: 'borderBottomColor',
        TintColor: 'tintColor',
    };

    static getStyle(color: UIColorData, colorStyle: string) {
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
        return this.getStyle(color, this.Styles.Color);
    }

    static getBackgroundColorStyle(color: UIColorData) {
        return this.getStyle(color, this.Styles.BackgroundColor);
    }

    static getBorderBottomColorStyle(color: UIColorData) {
        return this.getStyle(color, this.Styles.BorderBottomColor);
    }

    static getTintColorStyle(color: UIColorData) {
        return this.getStyle(color, this.Styles.TintColor);
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
        const borderColor = UIColor.boderBottomLightColor(theme);
        return this.getBorderBottomColorStyle(borderColor);
    }

    static borderBottom(theme: ?UIColorThemeNameType, focused: boolean) {
        const borderColor = UIColor.borderBottomColor(theme, focused);
        return this.getBorderBottomColorStyle(borderColor);
    }
}
