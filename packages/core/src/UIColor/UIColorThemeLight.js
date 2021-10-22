// @flow
import { LightTheme } from '@tonlabs/uikit.themes';

import UIColorPalette from './UIColorPalette';
import type { UIColorThemeData } from './UIColorTypes';

const UIColorThemeLight: UIColorThemeData = {
    borderBottom: {
        normal: LightTheme.LinePrimary, // UIColorPalette.light,
        focused: LightTheme.LineAccent, // UIColorPalette.primary,
        light: LightTheme.LineSecondary, // UIColorPalette.whiteLight,
        hover: LightTheme.LineNeutral, // UIColorPalette.black,
    },
    text: {
        primary: {
            normal: LightTheme.TextPrimary, // UIColorPalette.text.lightPrimary,
            disabled: LightTheme.TextNeutral, // UIColorPalette.text.lightNeutral,
            tapped: UIColorPalette.primary5,
            hover: UIColorPalette.primary4,
        },
        secondary: LightTheme.TextSecondary, // UIColorPalette.text.lightSecondary,
        tertiary: LightTheme.TextTertiary, // UIColorPalette.text.lightTertiary,
        quaternary: LightTheme.TextTertiary, // UIColorPalette.text.lightQuarternary,
        action: LightTheme.TextAccent, // UIColorPalette.primary,
        paragraph: LightTheme.TextPrimary, // UIColorPalette.text.lightParagraph,
        caution: LightTheme.TextWarning, // UIColorPalette.text.lightCaution,
        placeholder: LightTheme.TextTertiary, // UIColorPalette.text.lightTertiary,
        accent: LightTheme.TextAccent, // UIColorPalette.text.lightAccent,
        positive: LightTheme.TextPositive, // UIColorPalette.text.lightPositive,
        negative: LightTheme.TextNegative, // UIColorPalette.text.lightNegative,
    },
    background: {
        primary: LightTheme.BackgroundPrimary, // UIColorPalette.background.lightPrimary,
        primaryInverted: LightTheme.BackgroundPrimaryInverted, // UIColorPalette.background.lightPrimaryInverted,
        secondary: LightTheme.BackgroundSecondary, // UIColorPalette.background.lightSecondary,
        tertiary: LightTheme.BackgroundTertiary, // UIColorPalette.background.lightTertiary,
        quarter: LightTheme.BackgroundTertiary, // UIColorPalette.background.lightQuarter,
        quinary: LightTheme.BackgroundTertiary, // UIColorPalette.background.lightQuinary,
        whiteLight: LightTheme.BackgroundNeutral, //  UIColorPalette.background.lightWhiteLight,
        positive: LightTheme.BackgroundPositive, // UIColorPalette.background.lightPositive,
        negative: LightTheme.BackgroundNegative, // UIColorPalette.background.lightNegative,
        brake: UIColorPalette.background.lightBrake,
    },
    button: {
        background: {
            normal: LightTheme.LineAccent, // UIColorPalette.primary,
            tapped: UIColorPalette.primary5,
            hover: UIColorPalette.primary4,
        },
        title: {
            normal: LightTheme.TextPrimaryInverted, // UIColorPalette.white,
            disabled: LightTheme.TextNeutral, // UIColorPalette.light,
        },
    },
    detailsInput: {
        comment: LightTheme.TextNegative, // UIColorPalette.error,
        amount: {
            placeholder: LightTheme.TextTertiary, // UIColorPalette.text.lightQuarternary,
        },
    },
};

export default UIColorThemeLight;
