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
    TextOverlay = 'TextOverlay',
    TextOverlayInverted = 'TextOverlayInverted',
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
    BackgroundBW = 'BackgroundBW',
    // BackgroundNulled = 'BackgroundNulled',
    LinePrimary = 'LinePrimary',
    LineSecondary = 'LineSecondary',
    LineTertiary = 'LineTertiary',
    LineNeutral = 'LineNeutral',
    LineAccent = 'LineAccent',
    LineNegative = 'LineNegative',
    LinePositive = 'LinePositive',
    LineOverlayLight = 'LineOverlayLight',
    LineOverlayDark = 'LineOverlayDark',
    SpecialAccentLight = 'SpecialAccentLight',
    SpecialAccentDark = 'SpecialAccentDark',
    IconAccent = 'IconAccent',
    // IconPrimary = 'IconPrimary',
    IconSecondary = 'IconSecondary',
    // IconTertiary = 'IconTertiary',
    // IconPrimaryInverted = 'IconPrimaryInverted',
    IconNeutral = 'IconNeutral',
    // IconNegative = 'IconNegative',
    // That ones are for technical reasons
    Transparent = 'Transparent',
    KeyboardStyle = 'KeyboardStyle',
    StaticTextPrimaryDark = 'StaticTextPrimaryDark',
    StaticTextPrimaryLight = 'StaticTextPrimaryLight',
    StaticTextOverlayDark = 'StaticTextOverlayDark',
    StaticTextOverlayLight = 'StaticTextOverlayLight',
    StaticBackgroundBlack = 'StaticBackgroundBlack',
    StaticBackgroundWhite = 'StaticBackgroundWhite',
    StaticIconPrimaryDark = 'StaticIconPrimaryDark',
    StaticIconPrimaryLight = 'StaticIconPrimaryLight',
    StaticHoverOverlay = 'StaticHoverOverlay',
    StaticPressOverlay = 'StaticPressOverlay',
    StaticBlack = 'StaticBlack',
    StaticBackgroundAccent = 'StaticBackgroundAccent',
    StaticBackgroundNegative = 'StaticBackgroundNegative',
    StaticBackgroundPositive = 'StaticBackgroundPositive',
    Shadow = 'Shadow',
}

export type Theme = {
    [variant in ColorVariants]: ColorValue;
};

const StaticTheme = {
    [ColorVariants.StaticTextPrimaryDark]: '#20262A',
    [ColorVariants.StaticTextPrimaryLight]: '#FDFDFD',
    [ColorVariants.StaticTextOverlayDark]: 'rgba(32, 38, 42, 0.6)',
    [ColorVariants.StaticTextOverlayLight]: 'rgba(253, 253, 253, 0.6)',
    [ColorVariants.StaticBackgroundBlack]: '#131719',
    [ColorVariants.StaticBackgroundWhite]: '#FFFFFF',
    [ColorVariants.StaticIconPrimaryDark]: '#20262A',
    [ColorVariants.StaticIconPrimaryLight]: '#FDFDFD',
    [ColorVariants.StaticHoverOverlay]: 'rgba(32, 38, 42, 0.2)',
    [ColorVariants.StaticPressOverlay]: 'rgba(32, 38, 42, 0.4)',
    [ColorVariants.StaticBlack]: '#000000',
    [ColorVariants.StaticBackgroundAccent]: 'rgba(0, 131, 224, 0.12)',
    [ColorVariants.StaticBackgroundNegative]: 'rgba(231, 23, 23, 0.12)',
    [ColorVariants.StaticBackgroundPositive]: 'rgba(54, 192, 92, 0.12)',
};

export const LightTheme: Theme = {
    ...StaticTheme,
    [ColorVariants.TextPrimary]: '#20262A',
    [ColorVariants.TextSecondary]: '#707376',
    [ColorVariants.TextTertiary]: '#B6B8BA',
    [ColorVariants.TextPrimaryInverted]: '#FAFAFA',
    [ColorVariants.TextNeutral]: '#E2E3E4',
    [ColorVariants.TextAccent]: '#0073C4',
    [ColorVariants.TextNegative]: '#CA1414',
    [ColorVariants.TextPositive]: '#2FA851',
    [ColorVariants.TextWarning]: '#B08229',
    [ColorVariants.TextOverlay]: 'rgba(32, 38, 42, 0.6)',
    [ColorVariants.TextOverlayInverted]: 'rgba(250, 250, 250, 0.4)',

    [ColorVariants.BackgroundPrimary]: '#FAFAFA',
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
    [ColorVariants.BackgroundBW]: '#FFFFFF',

    [ColorVariants.LinePrimary]: '#F4F4F5',
    [ColorVariants.LineSecondary]: '#EBECEC',
    [ColorVariants.LineTertiary]: '#E2E3E4',
    [ColorVariants.LineNeutral]: '#20262A',
    [ColorVariants.LineAccent]: '#0083E0',
    [ColorVariants.LineNegative]: '#CA1414',
    [ColorVariants.LinePositive]: '#2FA851',
    [ColorVariants.LineOverlayDark]: 'rgba(255,255,255,.08)',
    [ColorVariants.LineOverlayLight]: 'rgba(0,0,0,.04)',

    [ColorVariants.SpecialAccentLight]: '#339CE6',
    [ColorVariants.SpecialAccentDark]: '#0069B3',

    [ColorVariants.IconAccent]: '#0073C4',
    // [ColorVariants.IconPrimary]: '#20262A',
    [ColorVariants.IconSecondary]: '#707376',
    // [ColorVariants.IconTertiary]: '#B6B8BA',
    // [ColorVariants.IconPrimary]Inverted: '#FDFDFD',
    [ColorVariants.IconNeutral]: '#E2E3E4',
    // [ColorVariants.IconNegative]: '#CA1414',
    [ColorVariants.Transparent]: 'rgba(0,0,0,0)',
    [ColorVariants.KeyboardStyle]: 'light',

    [ColorVariants.Shadow]: 'rgb(32, 38, 42)',
};

export const DarkTheme: Theme = {
    ...StaticTheme,
    [ColorVariants.TextPrimary]: '#FAFAFA',
    [ColorVariants.TextSecondary]: '#ADB0B1',
    [ColorVariants.TextTertiary]: '#676B6E',
    [ColorVariants.TextPrimaryInverted]: '#20262A',
    [ColorVariants.TextNeutral]: '#3B4043',
    [ColorVariants.TextAccent]: '#0083E0',
    [ColorVariants.TextNegative]: '#E71717',
    [ColorVariants.TextPositive]: '#36C05C',
    [ColorVariants.TextWarning]: '#FFC043',
    [ColorVariants.TextOverlay]: 'rgba(250, 250, 250, 0.4)',
    [ColorVariants.TextOverlayInverted]: 'rgba(32, 38, 42, 0.6)',

    [ColorVariants.BackgroundPrimary]: '#20262A',
    [ColorVariants.BackgroundSecondary]: '#292F32',
    [ColorVariants.BackgroundTertiary]: '#32373B',
    [ColorVariants.BackgroundNeutral]: '#3B4043',
    [ColorVariants.BackgroundAccent]: '#0073C4',
    [ColorVariants.BackgroundNegative]: '#CA1414',
    [ColorVariants.BackgroundPositive]: '#2FA851',
    [ColorVariants.BackgroundWarning]: '#B08229',
    [ColorVariants.BackgroundPrimaryInverted]: '#FAFAFA',
    [ColorVariants.BackgroundTertiaryInverted]: '#676B6E',
    [ColorVariants.BackgroundOverlay]: 'rgba(0, 0, 0, 0.8)',
    [ColorVariants.BackgroundOverlayInverted]: 'rgba(255, 255, 255, 0.2)',
    [ColorVariants.BackgroundBW]: '#1C2125',

    [ColorVariants.LinePrimary]: '#292F32',
    [ColorVariants.LineSecondary]: '#32373B',
    [ColorVariants.LineTertiary]: '#32373B',
    [ColorVariants.LineNeutral]: '#FAFAFA',
    [ColorVariants.LineAccent]: '#0073C4',
    [ColorVariants.LineNegative]: '#CA1414',
    [ColorVariants.LinePositive]: '#36C05C',
    [ColorVariants.LineOverlayDark]: 'rgba(0,0,0,.08)',
    [ColorVariants.LineOverlayLight]: 'rgba(255,255,255,.08)',

    [ColorVariants.SpecialAccentLight]: '#338FD0',
    [ColorVariants.SpecialAccentDark]: '#005C9D',

    [ColorVariants.IconAccent]: '#0073C4',
    [ColorVariants.IconSecondary]: '#ADB0B1',
    [ColorVariants.IconNeutral]: '#3B4043',

    [ColorVariants.Transparent]: 'rgba(0,0,0,0)',
    [ColorVariants.KeyboardStyle]: 'dark',

    [ColorVariants.Shadow]: 'rgb(32, 38, 42)',
};

export const ThemeContext = React.createContext(LightTheme);

export function useTheme() {
    return React.useContext(ThemeContext);
}

const Shadow = {
    1: {
        offset: {
            width: 0,
            height: 1,
        },
        opacity: 0.1,
        radius: 2,
    },
    2: {
        offset: {
            width: 0,
            height: 3,
        },
        opacity: 0.03,
        radius: 8,
    },
    3: {
        offset: {
            width: 0,
            height: 6,
        },
        opacity: 0.04,
        radius: 16,
    },
    4: {
        offset: {
            width: 0,
            height: 4,
        },
        opacity: 0.06,
        radius: 16,
    },
    5: {
        offset: {
            width: 0,
            height: 8,
        },
        opacity: 0.1,
        radius: 20,
    },
    6: {
        offset: {
            width: -1,
            height: 1,
        },
        opacity: 0.05,
        radius: 32,
    },
};

export function useShadow(level: 1 | 2 | 3 | 4 | 5 | 6) {
    const theme = useTheme();
    return React.useMemo(
        () => ({
            shadowColor: theme[ColorVariants.Shadow] as ColorValue,
            shadowOffset: Shadow[level].offset,
            shadowOpacity: Shadow[level].opacity,
            shadowRadius: Shadow[level].radius,
            elevation: level,
        }),
        [theme, level],
    );
}
