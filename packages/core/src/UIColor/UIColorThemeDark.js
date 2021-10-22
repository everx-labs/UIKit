// @flow
import { DarkTheme } from '@tonlabs/uikit.themes';

import UIColorPalette from './UIColorPalette';
import type { UIColorThemeData } from './UIColorTypes';

const UIColorThemeDark: UIColorThemeData = {
    borderBottom: {
        normal: DarkTheme.LinePrimary, // UIColorPalette.light,
        focused: DarkTheme.LineAccent, // UIColorPalette.primary,
        light: DarkTheme.LineSecondary, // UIColorPalette.whiteLight,
        hover: DarkTheme.LineNeutral, // UIColorPalette.white,
    },
    text: {
        primary: {
            normal: DarkTheme.TextPrimary, // UIColorPalette.text.darkPrimary,
            disabled: DarkTheme.TextNeutral, // UIColorPalette.text.darkNeutral,
            tapped: UIColorPalette.primary2,
            hover: UIColorPalette.primary1,
        },
        secondary: DarkTheme.TextSecondary, // UIColorPalette.text.darkSecondary,
        tertiary: DarkTheme.TextTertiary, // UIColorPalette.text.darkTertiary,
        quaternary: DarkTheme.TextTertiary, // UIColorPalette.text.darkQuarternary,
        action: DarkTheme.TextAccent, // UIColorPalette.white,
        paragraph: DarkTheme.TextPrimary, // UIColorPalette.text.darkParagraph,
        caution: DarkTheme.TextWarning, // UIColorPalette.text.darkCaution,
        placeholder: DarkTheme.TextTertiary, // UIColorPalette.primary3,
        accent: DarkTheme.TextAccent, // UIColorPalette.text.darkAccent,
        positive: DarkTheme.TextPositive, // UIColorPalette.text.darkPositive,
        negative: DarkTheme.TextNegative, // UIColorPalette.text.darkNegative,
    },
    background: {
        primary: DarkTheme.BackgroundPrimary, // UIColorPalette.background.darkPrimary,
        primaryInverted: DarkTheme.BackgroundPrimaryInverted, // UIColorPalette.background.darkPrimaryInverted,
        secondary: DarkTheme.BackgroundSecondary, // UIColorPalette.background.darkSecondary,
        tertiary: DarkTheme.BackgroundTertiary, // UIColorPalette.background.darkTertiary,
        quarter: DarkTheme.BackgroundTertiary, // UIColorPalette.background.darkQuarter,
        quinary: DarkTheme.BackgroundTertiary, // UIColorPalette.background.darkQuinary,
        whiteLight: DarkTheme.BackgroundNeutral, // UIColorPalette.background.darkWhiteLight,
        positive: DarkTheme.BackgroundPositive, // UIColorPalette.background.darkPositive,
        negative: DarkTheme.BackgroundNegative, // UIColorPalette.background.darkNegative,
        brake: UIColorPalette.background.darkBrake,
    },
    button: {
        background: {
            normal: DarkTheme.LineAccent, // UIColorPalette.primary,
            tapped: UIColorPalette.primary5,
            hover: UIColorPalette.primary4,
        },
        title: {
            normal: DarkTheme.TextPrimaryInverted, // UIColorPalette.white,
            disabled: DarkTheme.TextNeutral, // UIColorPalette.light,
        },
    },
    detailsInput: {
        comment: DarkTheme.TextNegative, // UIColorPalette.white,
        amount: {
            placeholder: DarkTheme.TextTertiary, // UIColorPalette.text.darkQuarternary,
        },
    },
};

export default UIColorThemeDark;
