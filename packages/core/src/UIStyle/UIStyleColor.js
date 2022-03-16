// @flow
import { StyleSheet } from 'react-native';

type ColorStyle = string;

type UIColorData = string;

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

    static getBackgroundColorStyle(color: UIColorData) {
        return this.getStyle(color, this.styles.backgroundColor);
    }
}
