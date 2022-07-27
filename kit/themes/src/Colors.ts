import * as React from 'react';

import type { ColorValue } from 'react-native';

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
    TextNulled = 'TextNulled',
    BackgroundPrimary = 'BackgroundPrimary',
    BackgroundSecondary = 'BackgroundSecondary',
    BackgroundTertiary = 'BackgroundTertiary',
    BackgroundNeutral = 'BackgroundNeutral',
    BackgroundAccent = 'BackgroundAccent',
    BackgroundNegative = 'BackgroundNegative',
    BackgroundPositive = 'BackgroundPositive',
    BackgroundWarning = 'BackgroundWarning',
    BackgroundPrimaryInverted = 'BackgroundPrimaryInverted',
    BackgroundSecondaryInverted = 'BackgroundSecondaryInverted',
    BackgroundTertiaryInverted = 'BackgroundTertiaryInverted',
    BackgroundOverlay = 'BackgroundOverlay',
    BackgroundOverlayInverted = 'BackgroundOverlayInverted',
    BackgroundOverlayDark = 'BackgroundOverlayDark',
    BackgroundOverlayLight = 'BackgroundOverlayLight',
    BackgroundNulled = 'BackgroundNulled',
    BackgroundBW = 'BackgroundBW',
    GraphPrimary = 'GraphPrimary',
    GraphSecondary = 'GraphSecondary',
    GraphTertiary = 'GraphTertiary',
    GraphPrimaryInverted = 'GraphPrimaryInverted',
    GraphNeutral = 'GraphNeutral',
    GraphAccent = 'GraphAccent',
    GraphNegative = 'GraphNegative',
    GraphPositive = 'GraphPositive',
    GraphWarning = 'GraphWarning',
    SpecialAccentLight = 'SpecialAccentLight',
    SpecialAccentDark = 'SpecialAccentDark',
    SpecialNegativeLight = 'SpecialNegativeLight',
    SpecialNegativeDark = 'SpecialNegativeDark',

    /** Static colors */
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
}

export type Theme = {
    [variant in ColorVariants]: ColorValue;
};

const StaticTheme = {
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
};

export const LightTheme: Theme = {
    ...StaticTheme,
    [ColorVariants.TextPrimary]: '#20262A',
    [ColorVariants.TextSecondary]: '#292F32',
    [ColorVariants.TextTertiary]: '#32373B',
    [ColorVariants.TextPrimaryInverted]: '#FDFDFD',
    [ColorVariants.TextNeutral]: '#3B4043',
    [ColorVariants.TextAccent]: '#4963E6',
    [ColorVariants.TextNegative]: '#E71717',
    [ColorVariants.TextPositive]: '#36C05C',
    [ColorVariants.TextWarning]: '#FFC043',
    [ColorVariants.TextOverlay]: 'rgba(32, 38, 42, 0.4)', // #20262A 40%
    [ColorVariants.TextOverlayInverted]: 'rgba(253, 253, 253, 0.6)', // #FDFDFD 60%
    [ColorVariants.TextNulled]: 'rgba(255, 255, 255, 0)', // #FFFFFF 0%

    [ColorVariants.BackgroundPrimary]: '#FDFDFD',
    [ColorVariants.BackgroundSecondary]: '#ADB0B1',
    [ColorVariants.BackgroundTertiary]: '#676B6E',
    [ColorVariants.BackgroundNeutral]: '#3B4043',
    [ColorVariants.BackgroundAccent]: '#4963E6',
    [ColorVariants.BackgroundNegative]: '#E71717',
    [ColorVariants.BackgroundPositive]: '#36C05C',
    [ColorVariants.BackgroundWarning]: '#FFC043',
    [ColorVariants.BackgroundPrimaryInverted]: '#20262A',
    [ColorVariants.BackgroundSecondaryInverted]: '#292F32',
    [ColorVariants.BackgroundTertiaryInverted]: '#32373B',
    [ColorVariants.BackgroundOverlay]: 'rgba(4, 4, 4, 0.4)', // #040404 40%
    [ColorVariants.BackgroundOverlayInverted]: 'rgba(253, 253, 253, 0.4)', // #FDFDFD 40%
    [ColorVariants.BackgroundOverlayDark]: 'rgba(0, 0, 0, 0.12)', // #000000 12%
    [ColorVariants.BackgroundOverlayLight]: 'rgba(255, 255, 255, 0.08)', // #FFFFFF 8%
    [ColorVariants.BackgroundNulled]: 'rgba(255, 255, 255, 0)', // #FFFFFF 0%
    [ColorVariants.BackgroundBW]: '#FFFFFF',

    [ColorVariants.GraphPrimary]: '#20262A',
    [ColorVariants.GraphSecondary]: '#292F32',
    [ColorVariants.GraphTertiary]: '#32373B',
    [ColorVariants.GraphPrimaryInverted]: '#FDFDFD',
    [ColorVariants.GraphNeutral]: '#3B4043',
    [ColorVariants.GraphAccent]: '#4963E6',
    [ColorVariants.GraphNegative]: '#E71717',
    [ColorVariants.GraphPositive]: '#36C05C',
    [ColorVariants.GraphWarning]: '#FFC043',

    [ColorVariants.SpecialAccentLight]: '#6184FF',
    [ColorVariants.SpecialAccentDark]: '#4259CF',
    [ColorVariants.SpecialNegativeLight]: '#D54343',
    [ColorVariants.SpecialNegativeDark]: '#A21010',

    [ColorVariants.Transparent]: 'rgba(0,0,0,0)',
    [ColorVariants.KeyboardStyle]: 'light',

    [ColorVariants.Shadow]: 'rgb(32, 38, 42)',
    [ColorVariants.ShadowOpaque]: 'rgba(32, 38, 42, 0.08)',
};

export const DarkTheme: Theme = {
    ...StaticTheme,
    [ColorVariants.TextPrimary]: '#FDFDFD',
    [ColorVariants.TextSecondary]: '#FDFDFD',
    [ColorVariants.TextTertiary]: '#676B6E',
    [ColorVariants.TextPrimaryInverted]: '#20262A',
    [ColorVariants.TextNeutral]: '#3B4043',
    [ColorVariants.TextAccent]: '#4963E6',
    [ColorVariants.TextNegative]: '#E71717',
    [ColorVariants.TextPositive]: '#36C05C',
    [ColorVariants.TextWarning]: '#FFC043',
    [ColorVariants.TextOverlay]: 'rgba(253, 253, 253, 0.4)', // FDFDFD 40%
    [ColorVariants.TextOverlayInverted]: 'rgba(4, 4, 4, 0.6)', // #040404 60%
    [ColorVariants.TextNulled]: 'rgba(0, 0, 0, 0)', // #000000 0%

    [ColorVariants.BackgroundPrimary]: '#20262A',
    [ColorVariants.BackgroundSecondary]: '#292F32',
    [ColorVariants.BackgroundTertiary]: '#32373B',
    [ColorVariants.BackgroundNeutral]: '#3B4043',
    [ColorVariants.BackgroundAccent]: '#4963E6',
    [ColorVariants.BackgroundNegative]: '#E71717',
    [ColorVariants.BackgroundPositive]: '#36C05C',
    [ColorVariants.BackgroundWarning]: '#FFC043',
    [ColorVariants.BackgroundPrimaryInverted]: '#FDFDFD',
    [ColorVariants.BackgroundSecondaryInverted]: '#ADB0B1',
    [ColorVariants.BackgroundTertiaryInverted]: '#676B6E',
    [ColorVariants.BackgroundOverlay]: 'rgba(4, 4, 4, 0.6)', // #040404 60%
    [ColorVariants.BackgroundOverlayInverted]: 'rgba(253, 253, 253, 0.2)', // #FDFDFD 20%
    [ColorVariants.BackgroundOverlayDark]: 'rgba(0, 0, 0, 0.08)', // #000000 8%
    [ColorVariants.BackgroundOverlayLight]: 'rgba(255, 255, 255, 0.04)', // #FFFFFF 4%
    [ColorVariants.BackgroundNulled]: 'rgba(0, 0, 0, 0)', // #000000 0%
    [ColorVariants.BackgroundBW]: '#1C2125',

    [ColorVariants.GraphPrimary]: '#FDFDFD',
    [ColorVariants.GraphSecondary]: '#ADB0B1',
    [ColorVariants.GraphTertiary]: '#676B6E',
    [ColorVariants.GraphPrimaryInverted]: '#20262A',
    [ColorVariants.GraphNeutral]: '#3B4043',
    [ColorVariants.GraphAccent]: '#4963E6',
    [ColorVariants.GraphNegative]: '#E71717',
    [ColorVariants.GraphPositive]: '#36C05C',
    [ColorVariants.GraphWarning]: '#FFC043',

    [ColorVariants.SpecialAccentLight]: '#6184FF',
    [ColorVariants.SpecialAccentDark]: '#4259CF',
    [ColorVariants.SpecialNegativeLight]: '#D54343',
    [ColorVariants.SpecialNegativeDark]: '#A21010',

    [ColorVariants.Transparent]: 'rgba(0,0,0,0)',
    [ColorVariants.KeyboardStyle]: 'dark',

    [ColorVariants.Shadow]: 'rgb(19, 23, 25)',
    [ColorVariants.ShadowOpaque]: 'rgba(19, 23, 25, 0.4)',
};

export const ThemeContext = React.createContext(LightTheme);

export function useTheme() {
    return React.useContext(ThemeContext);
}
