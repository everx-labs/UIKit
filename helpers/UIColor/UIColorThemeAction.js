// @flow
import UIColorPalette from './UIColorPalette';
import type { UIColorThemeData } from './UIColorTypes';

const UIColorThemeAction: UIColorThemeData = {
    borderBottom: {
        normal: UIColorPalette.primaryMinus,
        focused: UIColorPalette.primary3,
        light: UIColorPalette.whiteLight,
        hover: UIColorPalette.primary2,
    },
    text: {
        primary: {
            normal: UIColorPalette.text.darkPrimary,
            disabled: UIColorPalette.text.darkSecondary,
            tapped: UIColorPalette.primary2,
            hover: UIColorPalette.primary1,
        },
        secondary: UIColorPalette.text.darkSecondary,
        tertiary: UIColorPalette.primary3,
        quaternary: UIColorPalette.text.darkQuarternary,
        action: UIColorPalette.white,
        paragraph: UIColorPalette.text.darkParagraph,
        caution: UIColorPalette.text.darkCaution,
        placeholder: UIColorPalette.primary3,
        accent: UIColorPalette.text.darkAccent,
    },
    background: {
        primary: UIColorPalette.background.darkPrimary,
        secondary: UIColorPalette.background.darkSecondary,
        tertiary: UIColorPalette.background.darkTertiary,
        quarter: UIColorPalette.primaryPlus,
        quinary: UIColorPalette.background.darkQuinary,
        whiteLight: UIColorPalette.background.darkWhiteLight,
        positive: UIColorPalette.background.darkPositive,
    },
    button: {
        background: {
            normal: UIColorPalette.primaryPlus,
            tapped: UIColorPalette.primary6,
            hover: UIColorPalette.primary4,
        },
        title: {
            normal: UIColorPalette.grey1,
            disabled: UIColorPalette.primary,
        },
    },
    detailsInput: {
        comment: UIColorPalette.white,
        amount: {
            placeholder: UIColorPalette.primary3,
        },
    },
};

export default UIColorThemeAction;
