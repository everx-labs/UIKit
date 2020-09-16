// @flow

import UIColorPalette from './UIColorPalette';
import type { UIColorThemeData } from './UIColorTypes';

const UIColorThemeDark: UIColorThemeData = {
    borderBottom: {
        normal: UIColorPalette.light,
        focused: UIColorPalette.primary,
        light: UIColorPalette.whiteLight,
        hover: UIColorPalette.white,
    },
    text: {
        primary: {
            normal: UIColorPalette.text.darkPrimary,
            disabled: UIColorPalette.text.darkNeutral,
            tapped: UIColorPalette.primary2,
            hover: UIColorPalette.primary1,
        },
        secondary: UIColorPalette.text.darkSecondary,
        tertiary: UIColorPalette.text.darkTertiary,
        quaternary: UIColorPalette.text.darkQuarternary,
        action: UIColorPalette.white,
        paragraph: UIColorPalette.text.darkParagraph,
        caution: UIColorPalette.text.darkCaution,
        placeholder: UIColorPalette.primary3,
        accent: UIColorPalette.text.darkAccent,
        positive: UIColorPalette.text.darkPositive,
    },
    background: {
        primary: UIColorPalette.background.darkPrimary,
        secondary: UIColorPalette.background.darkSecondary,
        tertiary: UIColorPalette.background.darkTertiary,
        quarter: UIColorPalette.background.darkQuarter,
        quinary: UIColorPalette.background.darkQuinary,
        whiteLight: UIColorPalette.background.darkWhiteLight,
        positive: UIColorPalette.background.darkPositive,
        brake: UIColorPalette.background.darkBrake,
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
        comment: UIColorPalette.white,
        amount: {
            placeholder: UIColorPalette.text.darkQuarternary,
        },
    },
};

export default UIColorThemeDark;
