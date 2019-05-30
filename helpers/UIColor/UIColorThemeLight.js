// @flow

import UIColorPalette from './UIColorPalette';
import type { UIColorThemeData } from './UIColorTypes';

const UIColorThemeLight: UIColorThemeData = {
    borderBottom: {
        normal: UIColorPalette.light,
        focused: UIColorPalette.primary,
        light: UIColorPalette.whiteLight,
        hovered: UIColorPalette.blackLight,
    },
    text: {
        primary: {
            normal: UIColorPalette.text.lightPrimary,
            disabled: UIColorPalette.text.lightSecondary,
            tapped: UIColorPalette.primary5,
            hover: UIColorPalette.primary4,
        },
        secondary: UIColorPalette.text.lightSecondary,
        tertiary: UIColorPalette.text.lightTertiary,
        quaternary: UIColorPalette.text.lightQuarternary,
        action: UIColorPalette.primary,
        paragraph: UIColorPalette.text.lightParagraph,
        caution: UIColorPalette.text.lightCaution,
        placeholder: UIColorPalette.text.lightTertiary,
    },
    background: {
        primary: UIColorPalette.background.lightPrimary,
        secondary: UIColorPalette.background.lightSecondary,
        tertiary: UIColorPalette.background.lightTertiary,
        quarter: UIColorPalette.background.lightQuarter,
        quinary: UIColorPalette.background.lightQuinary,
        whiteLight: UIColorPalette.background.lightWhiteLight,
    },
    button: {
        background: {
            normal: UIColorPalette.primary,
            tapped: UIColorPalette.primary5,
            hover: UIColorPalette.primary4,
        },
        title: {
            normal: UIColorPalette.white,
            disabled: UIColorPalette.light,
        },
    },
    detailsInput: {
        comment: UIColorPalette.error,
    },
};


export default UIColorThemeLight;
