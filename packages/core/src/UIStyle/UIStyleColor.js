// @flow
import { StyleSheet } from 'react-native';

const backgroundColorStyles = {};

export default class UIStyleColor {
    static getBackgroundColorStyle(color: string) {
        let sheet = backgroundColorStyles[color];
        if (!sheet) {
            sheet = StyleSheet.create({
                style: {
                    backgroundColor: color,
                },
            });
            backgroundColorStyles[color] = sheet;
        }
        return sheet.style;
    }
}
