// @flow

import UIColorPalette from './UIColorPalette';
import type { UIColorThemeData } from './UIColorTypes';

const UIColorThemeLight: UIColorThemeData = {
    borderBottom: {
        normal: UIColorPalette.light,
        focused: UIColorPalette.primary,
        light: UIColorPalette.whiteLight,
        hover: UIColorPalette.black,
    },
    text: {
        primary: {
            normal: UIColorPalette.text.lightPrimary,
            disabled: UIColorPalette.text.lightNeutral,
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
        accent: UIColorPalette.text.lightAccent,
    },
    background: {
        primary: UIColorPalette.background.lightPrimary,
        secondary: UIColorPalette.background.lightSecondary,
        tertiary: UIColorPalette.background.lightTertiary,
        quarter: UIColorPalette.background.lightQuarter,
        quinary: UIColorPalette.background.lightQuinary,
        whiteLight: UIColorPalette.background.lightWhiteLight,
        positive: UIColorPalette.background.lightPositive,
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
        amount: {
            placeholder: UIColorPalette.text.lightQuarternary,
        },
    },
};


export default UIColorThemeLight;
