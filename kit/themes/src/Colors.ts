import * as React from 'react';

import type { ColorValue } from 'react-native';

function getThemeWithWarning<T extends ColorVariants>(theme: Record<T, string>): Record<T, string> {
    return Object.entries<string>(theme).reduce<Record<string, string>>((result, record) => {
        const key = record[0] as T;
        return {
            ...result,
            get [key]() {
                console.warn(`You have a deprecated color: ${key} in your color scheme`);
                return record[1];
            },
        };
    }, {});
}

export enum ColorVariants {
    TextBW = 'TextBW',
    TextPrimary = 'TextPrimary',
    TextSecondary = 'TextSecondary',
    TextTertiary = 'TextTertiary',
    TextInverted = 'TextInverted',
    TextAccent = 'TextAccent',
    TextNegative = 'TextNegative',
    TextPositive = 'TextPositive',
    TextWarning = 'TextWarning',
    TextNulled = 'TextNulled',

    BackgroundBW = 'BackgroundBW',
    BackgroundPrimary = 'BackgroundPrimary',
    BackgroundSecondary = 'BackgroundSecondary',
    BackgroundTertiary = 'BackgroundTertiary',
    BackgroundInverted = 'BackgroundInverted',
    BackgroundAccent = 'BackgroundAccent',
    BackgroundNegative = 'BackgroundNegative',
    BackgroundPositive = 'BackgroundPositive',
    BackgroundWarning = 'BackgroundWarning',
    BackgroundNulled = 'BackgroundNulled',

    GraphBW = 'GraphBW',
    GraphPrimary = 'GraphPrimary',
    GraphSecondary = 'GraphSecondary',
    GraphTertiary = 'GraphTertiary',
    GraphInverted = 'GraphInverted',
    GraphAccent = 'GraphAccent',
    GraphNegative = 'GraphNegative',
    GraphPositive = 'GraphPositive',
    GraphWarning = 'GraphWarning',
    GraphNulled = 'GraphNulled',

    SpecialAccentLight = 'SpecialAccentLight',
    SpecialAccentDark = 'SpecialAccentDark',
    SpecialNegativeLight = 'SpecialNegativeLight',
    SpecialNegativeDark = 'SpecialNegativeDark',

    /** Static colors */
    StaticBlack60 = 'StaticBlack60',
    StaticBlack40 = 'StaticBlack40',
    StaticBlack20 = 'StaticBlack20',
    StaticBlack10 = 'StaticBlack10',
    StaticWhite60 = 'StaticWhite60',
    StaticWhite40 = 'StaticWhite40',
    StaticWhite20 = 'StaticWhite20',
    StaticWhite10 = 'StaticWhite10',

    StaticUIBlack = 'StaticUIBlack',
    StaticUIWhite = 'StaticUIWhite',
    StaticUISurf = 'StaticUISurf',
    StaticUITransparent = 'StaticUITransparent',

    StaticBlue9 = 'StaticBlue9',
    StaticBlue8 = 'StaticBlue8',
    StaticBlue7 = 'StaticBlue7',
    StaticBlue6 = 'StaticBlue6',
    StaticBlue5 = 'StaticBlue5',
    StaticBlue4 = 'StaticBlue4',
    StaticBlue3 = 'StaticBlue3',
    StaticBlue2 = 'StaticBlue2',
    StaticBlue1 = 'StaticBlue1',
    StaticBlue0 = 'StaticBlue0',

    StaticMarketingMettwurst = 'StaticMarketingMettwurst',
    StaticMarketingMexicanChile = 'StaticMarketingMexicanChile',
    StaticMarketingOldGeranium = 'StaticMarketingOldGeranium',
    StaticMarketingWisteria = 'StaticMarketingWisteria',
    StaticMarketingTrueV = 'StaticMarketingTrueV',
    StaticMarketingAmexia = 'StaticMarketingAmexia',
    StaticMarketingBerlinBlue = 'StaticMarketingBerlinBlue',
    StaticMarketingKingTriton = 'StaticMarketingKingTriton',
    StaticMarketingBrig = 'StaticMarketingBrig',
    StaticMarketingWipeout = 'StaticMarketingWipeout',

    StaticEverscalePrimary = 'StaticEverscalePrimary',
    StaticEverscaleSecondary = 'StaticEverscaleSecondary',
    StaticEverscaleTetriary = 'StaticEverscaleTetriary',
    StaticEverscaleQuaternary = 'StaticEverscaleQuaternary',
    StaticEverscaleQuinary = 'StaticEverscaleQuinary',

    /** Shadow colors */
    Shadow = 'Shadow',
    ShadowOpaque = 'ShadowOpaque',

    /** UIKit internal colors */
    Transparent = 'Transparent',
    KeyboardStyle = 'KeyboardStyle',

    /** Legacy colors */
    TextNeutral = 'TextNeutral',
    TextPrimaryInverted = 'TextPrimaryInverted',
    TextOverlay = 'TextOverlay',
    TextOverlayInverted = 'TextOverlayInverted',

    BackgroundNeutral = 'BackgroundNeutral',
    BackgroundPrimaryInverted = 'BackgroundPrimaryInverted',
    BackgroundSecondaryInverted = 'BackgroundSecondaryInverted',
    BackgroundTertiaryInverted = 'BackgroundTertiaryInverted',
    BackgroundOverlay = 'BackgroundOverlay',
    BackgroundOverlayInverted = 'BackgroundOverlayInverted',
    BackgroundOverlayDark = 'BackgroundOverlayDark',
    BackgroundOverlayLight = 'BackgroundOverlayLight',

    GraphPrimaryInverted = 'GraphPrimaryInverted',
    GraphNeutral = 'GraphNeutral',

    LineOverlayLight = 'LineOverlayLight',
    LineOverlayDark = 'LineOverlayDark',

    IconAccent = 'IconAccent',
    IconSecondary = 'IconSecondary',
    IconNeutral = 'IconNeutral',

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
    StaticBackgroundOverlay = 'StaticBackgroundOverlay',

    /** Depracated color */
    LinePrimary = 'LinePrimary',
    /** Depracated color */
    LineSecondary = 'LineSecondary',
    /** Depracated color */
    LineTertiary = 'LineTertiary',
    /** Depracated color */
    LineNeutral = 'LineNeutral',
    /** Depracated color */
    LineAccent = 'LineAccent',
    /** Depracated color */
    LineNegative = 'LineNegative',
    /** Depracated color */
    LinePositive = 'LinePositive',
}

export type Theme = {
    [variant in ColorVariants]: ColorValue;
};

const StaticTheme = {
    [ColorVariants.StaticBlack60]: 'rgba(25, 30, 33, 0.6)', // #191E21 60%
    [ColorVariants.StaticBlack40]: 'rgba(25, 30, 33, 0.4)', // #191E21 40%
    [ColorVariants.StaticBlack20]: 'rgba(25, 30, 33, 0.2)', // #191E21 20%
    [ColorVariants.StaticBlack10]: 'rgba(25, 30, 33, 0.1)', // #191E21 10%
    [ColorVariants.StaticWhite60]: 'rgba(255, 255, 255, 0.6)', // #FFFFFF 60%
    [ColorVariants.StaticWhite40]: 'rgba(255, 255, 255, 0.4)', // #FFFFFF 40%
    [ColorVariants.StaticWhite20]: 'rgba(255, 255, 255, 0.2)', // #FFFFFF 20%
    [ColorVariants.StaticWhite10]: 'rgba(255, 255, 255, 0.1)', // #FFFFFF 10%

    [ColorVariants.StaticUIBlack]: '#1C2125',
    [ColorVariants.StaticUIWhite]: '#FFFFFF',
    [ColorVariants.StaticUISurf]: '#4963E6',
    [ColorVariants.StaticUITransparent]: 'rgba(73, 99, 230, 0.12)', // #4963E6 12%

    [ColorVariants.StaticBlue9]: '#304197',
    [ColorVariants.StaticBlue8]: '#3548A8',
    [ColorVariants.StaticBlue7]: '#3B50BA',
    [ColorVariants.StaticBlue6]: '#4259CF',
    [ColorVariants.StaticBlue5]: '#4963E6',
    [ColorVariants.StaticBlue4]: '#506DFD',
    [ColorVariants.StaticBlue3]: '#5878FF',
    [ColorVariants.StaticBlue2]: '#6184FF',
    [ColorVariants.StaticBlue1]: '#6B91FF',
    [ColorVariants.StaticBlue0]: '#769FFF',

    [ColorVariants.StaticMarketingMettwurst]: '#DF6F66',
    [ColorVariants.StaticMarketingMexicanChile]: '#D56E72',
    [ColorVariants.StaticMarketingOldGeranium]: '#C5638B',
    [ColorVariants.StaticMarketingWisteria]: '#B275C4',
    [ColorVariants.StaticMarketingTrueV]: '#8B76CA',
    [ColorVariants.StaticMarketingAmexia]: '#6B63C7',
    [ColorVariants.StaticMarketingBerlinBlue]: '#5480D3',
    [ColorVariants.StaticMarketingKingTriton]: '#3F85C0',
    [ColorVariants.StaticMarketingBrig]: '#4BA0BA',
    [ColorVariants.StaticMarketingWipeout]: '#3B8196',

    [ColorVariants.StaticEverscalePrimary]: '#210FB7',
    [ColorVariants.StaticEverscaleSecondary]: '#6347F5',
    [ColorVariants.StaticEverscaleTetriary]: '#FF6922',
    [ColorVariants.StaticEverscaleQuaternary]: '#FFD688',
    [ColorVariants.StaticEverscaleQuinary]: '#FFFFAE',

    /** Legacy colors */
    [ColorVariants.StaticTextPrimaryDark]: '#1C2124',
    [ColorVariants.StaticTextPrimaryLight]: '#EFEFF0',
    [ColorVariants.StaticTextOverlayDark]: 'rgba(32, 38, 42, 0.6)',
    [ColorVariants.StaticTextOverlayLight]: 'rgba(253, 253, 253, 0.6)',
    [ColorVariants.StaticBackgroundBlack]: '#131719',
    [ColorVariants.StaticBackgroundWhite]: '#FFFFFF',
    [ColorVariants.StaticIconPrimaryDark]: '#1C2124',
    [ColorVariants.StaticIconPrimaryLight]: '#EFEFF0',
    [ColorVariants.StaticHoverOverlay]: 'rgba(32, 38, 42, 0.2)',
    [ColorVariants.StaticPressOverlay]: 'rgba(32, 38, 42, 0.4)',
    [ColorVariants.StaticBlack]: '#000000',
    [ColorVariants.StaticBackgroundAccent]: 'rgba(0, 131, 224, 0.12)',
    [ColorVariants.StaticBackgroundNegative]: 'rgba(231, 23, 23, 0.12)',
    [ColorVariants.StaticBackgroundPositive]: 'rgba(54, 192, 92, 0.12)',
    [ColorVariants.StaticBackgroundOverlay]: 'rgba(4, 4, 4, 0.4)',
};

export const LightThemeDeprecated = {
    [ColorVariants.TextPrimaryInverted]: '#EFEFF0', // TextInverted
    [ColorVariants.BackgroundPrimaryInverted]: '#1C2124', // BackgroundInverted
    [ColorVariants.GraphPrimaryInverted]: '#EFEFF0', // GraphInverted
    [ColorVariants.LinePrimary]: '#EFEFF0', // GraphPrimaryInverted
    [ColorVariants.LineSecondary]: '#EFEFF0', // GraphPrimaryInverted
    [ColorVariants.LineTertiary]: '#EFEFF0', // GraphPrimaryInverted
    [ColorVariants.LineNeutral]: '#3B4043', // GraphNeutral
    [ColorVariants.LineAccent]: '#4963E6', // GraphAccent
    [ColorVariants.LineNegative]: '#FF0C0C', // GraphNegative
    [ColorVariants.LinePositive]: '#00D359', // GraphPositive

    /** Deprecated colors without analogues */
    [ColorVariants.TextNeutral]: '#3B4043',
    [ColorVariants.TextOverlay]: 'rgba(28, 33, 36, 0.4)', // #1C2124 40%
    [ColorVariants.TextOverlayInverted]: 'rgba(239, 239, 240, 0.6)', // #EFEFF0 60%
    [ColorVariants.BackgroundNeutral]: '#3B4043',
    [ColorVariants.BackgroundSecondaryInverted]: '#283035',
    [ColorVariants.BackgroundTertiaryInverted]: '#3B474E',
    [ColorVariants.BackgroundOverlay]: 'rgba(4, 4, 4, 0.4)', // #040404 40%
    [ColorVariants.BackgroundOverlayInverted]: 'rgba(239, 239, 240, 0.4)', // #EFEFF0 40%
    [ColorVariants.BackgroundOverlayDark]: 'rgba(0, 0, 0, 0.12)', // #000000 12%
    [ColorVariants.BackgroundOverlayLight]: 'rgba(255, 255, 255, 0.08)', // #FFFFFF 8%
    [ColorVariants.LineOverlayDark]: 'rgba(255, 255, 255, 0.08)', // #FFFFFF 8%
    [ColorVariants.LineOverlayLight]: 'rgba(0, 0, 0, 0.04)', // #000000 4%
    [ColorVariants.IconAccent]: '#0073C4',
    [ColorVariants.IconSecondary]: '#707376',
    [ColorVariants.IconNeutral]: '#E2E3E4',
};

export const LightTheme: Theme = {
    ...StaticTheme,
    ...getThemeWithWarning(LightThemeDeprecated),
    [ColorVariants.TextBW]: '#191E21',
    [ColorVariants.TextPrimary]: '#1C2124',
    [ColorVariants.TextSecondary]: '#283035',
    [ColorVariants.TextTertiary]: '#3B474E',
    [ColorVariants.TextInverted]: '#EFEFF0',
    [ColorVariants.TextAccent]: '#4963E6',
    [ColorVariants.TextNegative]: '#FF0C0C',
    [ColorVariants.TextPositive]: '#00D359',
    [ColorVariants.TextWarning]: '#FFB608',
    [ColorVariants.TextNulled]: 'rgba(255, 255, 255, 0)', // #FFFFFF 0%

    [ColorVariants.BackgroundBW]: '#FFFFFF',
    [ColorVariants.BackgroundPrimary]: '#EFEFF0',
    [ColorVariants.BackgroundSecondary]: '#E8E9E9',
    [ColorVariants.BackgroundTertiary]: '#D2D3D3',
    [ColorVariants.BackgroundInverted]: '#1C2124',
    [ColorVariants.BackgroundAccent]: '#4963E6',
    [ColorVariants.BackgroundNegative]: '#FF0C0C',
    [ColorVariants.BackgroundPositive]: '#00D359',
    [ColorVariants.BackgroundWarning]: '#FFB608',
    [ColorVariants.BackgroundNulled]: 'rgba(255, 255, 255, 0)', // #FFFFFF 0%

    [ColorVariants.GraphBW]: '#191E21',
    [ColorVariants.GraphPrimary]: '#1C2124',
    [ColorVariants.GraphSecondary]: '#283035',
    [ColorVariants.GraphTertiary]: '#3B474E',
    [ColorVariants.GraphInverted]: '#EFEFF0',
    [ColorVariants.GraphNeutral]: '#3B4043',
    [ColorVariants.GraphAccent]: '#4963E6',
    [ColorVariants.GraphNegative]: '#FF0C0C',
    [ColorVariants.GraphPositive]: '#00D359',
    [ColorVariants.GraphWarning]: '#FFB608',
    [ColorVariants.GraphNulled]: 'rgba(255, 255, 255, 0)', // #FFFFFF 0%

    [ColorVariants.SpecialAccentLight]: '#6184FF',
    [ColorVariants.SpecialAccentDark]: '#4259CF',
    [ColorVariants.SpecialNegativeLight]: '#D54343',
    [ColorVariants.SpecialNegativeDark]: '#A21010',

    [ColorVariants.Transparent]: 'rgba(0,0,0,0)',
    [ColorVariants.KeyboardStyle]: 'light',

    [ColorVariants.Shadow]: 'rgb(32, 38, 42)',
    [ColorVariants.ShadowOpaque]: 'rgba(32, 38, 42, 0.08)',
};

export const DarkThemeDeprecated = {
    [ColorVariants.LinePrimary]: '#1C2124', // GraphPrimaryInverted
    [ColorVariants.LineSecondary]: '#1C2124', // GraphPrimaryInverted
    [ColorVariants.LineTertiary]: '#1C2124', // GraphPrimaryInverted
    [ColorVariants.LineNeutral]: '#3B4043', // GraphNeutral
    [ColorVariants.LineAccent]: '#4963E6', // GraphAccent
    [ColorVariants.LineNegative]: '#4963E6', // GraphNegative
    [ColorVariants.LinePositive]: '#00D359', // GraphPositive
};

export const DarkTheme: Theme = {
    ...StaticTheme,
    ...getThemeWithWarning(DarkThemeDeprecated),
    [ColorVariants.TextPrimary]: '#EFEFF0',
    [ColorVariants.TextSecondary]: '#EFEFF0',
    [ColorVariants.TextTertiary]: '#D2D3D3',
    [ColorVariants.TextPrimaryInverted]: '#1C2124',
    [ColorVariants.TextNeutral]: '#3B4043',
    [ColorVariants.TextAccent]: '#4963E6',
    [ColorVariants.TextNegative]: '#FF0C0C',
    [ColorVariants.TextPositive]: '#00D359',
    [ColorVariants.TextWarning]: '#FFB608',
    [ColorVariants.TextOverlay]: 'rgba(253, 253, 253, 0.4)', // EFEFF0 40%
    [ColorVariants.TextOverlayInverted]: 'rgba(4, 4, 4, 0.6)', // #040404 60%
    [ColorVariants.TextNulled]: 'rgba(0, 0, 0, 0)', // #000000 0%

    [ColorVariants.BackgroundPrimary]: '#1C2124',
    [ColorVariants.BackgroundSecondary]: '#283035',
    [ColorVariants.BackgroundTertiary]: '#3B474E',
    [ColorVariants.BackgroundNeutral]: '#3B4043',
    [ColorVariants.BackgroundAccent]: '#4963E6',
    [ColorVariants.BackgroundNegative]: '#FF0C0C',
    [ColorVariants.BackgroundPositive]: '#00D359',
    [ColorVariants.BackgroundWarning]: '#FFB608',
    [ColorVariants.BackgroundPrimaryInverted]: '#EFEFF0',
    [ColorVariants.BackgroundSecondaryInverted]: '#E8E9E9',
    [ColorVariants.BackgroundTertiaryInverted]: '#D2D3D3',
    [ColorVariants.BackgroundOverlay]: 'rgba(4, 4, 4, 0.6)', // #040404 60%
    [ColorVariants.BackgroundOverlayInverted]: 'rgba(253, 253, 253, 0.2)', // #EFEFF0 20%
    [ColorVariants.BackgroundOverlayDark]: 'rgba(0, 0, 0, 0.08)', // #000000 8%
    [ColorVariants.BackgroundOverlayLight]: 'rgba(255, 255, 255, 0.04)', // #FFFFFF 4%
    [ColorVariants.BackgroundNulled]: 'rgba(0, 0, 0, 0)', // #000000 0%
    [ColorVariants.BackgroundBW]: '#1C2125',

    [ColorVariants.GraphPrimary]: '#EFEFF0',
    [ColorVariants.GraphSecondary]: '#E8E9E9',
    [ColorVariants.GraphTertiary]: '#D2D3D3',
    [ColorVariants.GraphPrimaryInverted]: '#1C2124',
    [ColorVariants.GraphNeutral]: '#3B4043',
    [ColorVariants.GraphAccent]: '#4963E6',
    [ColorVariants.GraphNegative]: '#FF0C0C',
    [ColorVariants.GraphPositive]: '#00D359',
    [ColorVariants.GraphWarning]: '#FFB608',

    [ColorVariants.SpecialAccentLight]: '#6184FF',
    [ColorVariants.SpecialAccentDark]: '#4259CF',
    [ColorVariants.SpecialNegativeLight]: '#D54343',
    [ColorVariants.SpecialNegativeDark]: '#A21010',

    [ColorVariants.Transparent]: 'rgba(0,0,0,0)',
    [ColorVariants.KeyboardStyle]: 'dark',

    [ColorVariants.Shadow]: 'rgb(19, 23, 25)',
    [ColorVariants.ShadowOpaque]: 'rgba(19, 23, 25, 0.4)',

    /** Legacy colors */
    [ColorVariants.LineOverlayDark]: 'rgba(0,0,0,.08)',
    [ColorVariants.LineOverlayLight]: 'rgba(255, 255, 255, 0.08)',
    [ColorVariants.IconAccent]: '#0073C4',
    [ColorVariants.IconSecondary]: '#E8E9E9',
    [ColorVariants.IconNeutral]: '#3B4043',
};

export const ThemeContext = React.createContext(LightTheme);

export function useTheme() {
    return React.useContext(ThemeContext);
}
