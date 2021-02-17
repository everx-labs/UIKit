import * as React from 'react';

import type { ColorValue } from 'react-native';

// TODO: commented colors is just work in progress
//       (not presented for both modes)
export enum ColorVariants {
    TextPrimary = 'TextPrimary',
    TextSecondary = 'TextSecondary',
    TextTertiary = 'TextTertiary',
    TextPrimaryInverted = 'TextPrimaryInverted',
    TextNeutral = 'TextNeutral',
    TextAccent = 'TextAccent',
    TextNegative = 'TextNegative',
    TextPositive = 'TextPositive',
    TextWarning = 'TextWarning',
    // TextOverlay = 'TextOverlay',
    // TextOverlayInverted = 'TextOverlayInverted',
    // TextNulled = 'TextNulled',
    BackgroundPrimary = 'BackgroundPrimary',
    BackgroundSecondary = 'BackgroundSecondary',
    BackgroundTertiary = 'BackgroundTertiary',
    BackgroundNeutral = 'BackgroundNeutral',
    BackgroundAccent = 'BackgroundAccent',
    BackgroundNegative = 'BackgroundNegative',
    BackgroundPositive = 'BackgroundPositive',
    BackgroundWarning = 'BackgroundWarning',
    BackgroundPrimaryInverted = 'BackgroundPrimaryInverted',
    // BackgroundSecondaryInverted = 'BackgroundSecondaryInverted',
    BackgroundTertiaryInverted = 'BackgroundTertiaryInverted',
    BackgroundOverlay = 'BackgroundOverlay',
    BackgroundOverlayInverted = 'BackgroundOverlayInverted',
    // BackgroundNulled = 'BackgroundNulled',
    // BackgroundBAndW = 'BackgroundBAndW',
    LinePrimary = 'LinePrimary',
    LineSecondary = 'LineSecondary',
    LineTertiary = 'LineTertiary',
    LineNeutral = 'LineNeutral',
    LineAccent = 'LineAccent',
    LineNegative = 'LineNegative',
    // IconAccent = 'IconAccent',
    // IconPrimary = 'IconPrimary',
    IconSecondary = 'IconSecondary',
    // IconTertiary = 'IconTertiary',
    // IconPrimaryInverted = 'IconPrimaryInverted',
    // IconNeutral = 'IconNeutral',
    // IconNegative = 'IconNegative',
    // That ones are for technical reasons
    Transparent = 'Transparent',
    KeyboardStyle = 'KeyboardStyle',
    StaticTextPrimaryDark = 'StaticTextPrimaryDark',
    StaticTextPrimaryLight = 'StaticTextPrimaryLight',
    StaticIconPrimaryDark = 'StaticIconPrimaryDark',
    StaticIconPrimaryLight = 'StaticIconPrimaryLight',
}

type Theme = {
    [variant in ColorVariants]: ColorValue;
};

export const LightTheme: Theme = {
    [ColorVariants.TextPrimary]: '#20262A',
    [ColorVariants.TextSecondary]: '#707376',
    [ColorVariants.TextTertiary]: '#B6B8BA',
    [ColorVariants.TextPrimaryInverted]: '#FDFDFD',
    [ColorVariants.TextNeutral]: '#E2E3E4',
    [ColorVariants.TextAccent]: '#0073C4',
    [ColorVariants.TextNegative]: '#CA1414',
    [ColorVariants.TextPositive]: '#2FA851',
    [ColorVariants.TextWarning]: '#B08229',

    [ColorVariants.BackgroundPrimary]: '#FDFDFD',
    [ColorVariants.BackgroundSecondary]: '#F4F4F5',
    [ColorVariants.BackgroundTertiary]: '#EBECEC',
    [ColorVariants.BackgroundNeutral]: '#E2E3E4',
    [ColorVariants.BackgroundAccent]: '#0083E0',
    [ColorVariants.BackgroundNegative]: '#E71717',
    [ColorVariants.BackgroundPositive]: '#36C05C',
    [ColorVariants.BackgroundWarning]: '#FFC043',
    [ColorVariants.BackgroundPrimaryInverted]: '#20262A',
    [ColorVariants.BackgroundTertiaryInverted]: '#B6B8BA',
    [ColorVariants.BackgroundOverlay]: 'rgba(0, 0, 0, 0.6)',
    [ColorVariants.BackgroundOverlayInverted]: 'rgba(255, 255, 255, 0.4)',

    [ColorVariants.LinePrimary]: '#F4F4F5',
    [ColorVariants.LineSecondary]: '#EBECEC',
    [ColorVariants.LineTertiary]: '#E2E3E4',
    [ColorVariants.LineNeutral]: '#20262A',
    [ColorVariants.LineAccent]: '#0083E0',
    [ColorVariants.LineNegative]: '#CA1414',

    // [ColorVariants.IconAccent]: '#0073C4',
    // [ColorVariants.IconPrimary]: '#20262A',
    [ColorVariants.IconSecondary]: '#707376',
    // [ColorVariants.IconTertiary]: '#B6B8BA',
    // [ColorVariants.IconPrimary]Inverted: '#FDFDFD',
    // [ColorVariants.IconNeutral]: '#E2E3E4',
    // [ColorVariants.IconNegative]: '#CA1414',
    [ColorVariants.Transparent]: 'rgba(0,0,0,0)',
    [ColorVariants.KeyboardStyle]: 'light',

    [ColorVariants.StaticTextPrimaryDark]: '#20262A',
    [ColorVariants.StaticTextPrimaryLight]: '#FDFDFD',
    [ColorVariants.StaticIconPrimaryDark]: '#20262A',
    [ColorVariants.StaticIconPrimaryLight]: '#FDFDFD',
};

export const DarkTheme: Theme = {
    [ColorVariants.TextPrimary]: '#FDFDFD',
    [ColorVariants.TextSecondary]: '#ADB0B1',
    [ColorVariants.TextTertiary]: '#676B6E',
    [ColorVariants.TextPrimaryInverted]: '#20262A',
    [ColorVariants.TextNeutral]: '#3B4043',
    [ColorVariants.TextAccent]: '#0083E0',
    [ColorVariants.TextNegative]: '#E71717',
    [ColorVariants.TextPositive]: '#36C05C',
    [ColorVariants.TextWarning]: '#FFC043',

    [ColorVariants.BackgroundPrimary]: '#20262A',
    [ColorVariants.BackgroundSecondary]: '#292F32',
    [ColorVariants.BackgroundTertiary]: '#32373B',
    [ColorVariants.BackgroundNeutral]: '#3B4043',
    [ColorVariants.BackgroundAccent]: '#0073C4',
    [ColorVariants.BackgroundNegative]: '#CA1414',
    [ColorVariants.BackgroundPositive]: '#2FA851',
    [ColorVariants.BackgroundWarning]: '#B08229',
    [ColorVariants.BackgroundPrimaryInverted]: '#FDFDFD',
    [ColorVariants.BackgroundTertiaryInverted]: '#676B6E',
    [ColorVariants.BackgroundOverlay]: 'rgba(0, 0, 0, 0.8)',
    [ColorVariants.BackgroundOverlayInverted]: 'rgba(255, 255, 255, 0.2)',

    [ColorVariants.LinePrimary]: '#292F32',
    [ColorVariants.LineSecondary]: '#32373B',
    [ColorVariants.LineTertiary]: '#32373B',
    [ColorVariants.LineNeutral]: '#FDFDFD',
    [ColorVariants.LineAccent]: '#0073C4',
    [ColorVariants.LineNegative]: '#CA1414',

    [ColorVariants.IconSecondary]: '#ADB0B1',

    [ColorVariants.Transparent]: 'rgba(0,0,0,0)',
    [ColorVariants.KeyboardStyle]: 'dark',

    [ColorVariants.StaticTextPrimaryDark]: '#20262A',
    [ColorVariants.StaticTextPrimaryLight]: '#FDFDFD',
    [ColorVariants.StaticIconPrimaryDark]: '#20262A',
    [ColorVariants.StaticIconPrimaryLight]: '#FDFDFD',
};

export const ThemeContext = React.createContext(LightTheme);

export function useTheme() {
    return React.useContext(ThemeContext);
}
