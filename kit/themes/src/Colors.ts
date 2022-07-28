import * as React from 'react';

import { ColorValue, Platform } from 'react-native';

function warnAboutDeprecatedColorVariant(colorVariant: ColorVariants) {
    const message = `You have a deprecated color: ${colorVariant} in your color scheme`;
    Platform.OS === 'web' ? console.error(message) : console.warn(message);
}

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

    /** Legacy colors */
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
    [ColorVariants.StaticBackgroundOverlay]: 'rgba(4, 4, 4, 0.4)',
};

export const LightThemeDeprecated = {
    get [ColorVariants.LinePrimary]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LinePrimary);
        return '#FDFDFD'; // GraphPrimaryInverted
    },
    get [ColorVariants.LineSecondary]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineSecondary);
        return '#FDFDFD'; // GraphPrimaryInverted
    },
    get [ColorVariants.LineTertiary]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineTertiary);
        return '#FDFDFD'; // GraphPrimaryInverted
    },
    get [ColorVariants.LineNeutral]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineNeutral);
        return '#3B4043'; // GraphNeutral
    },
    get [ColorVariants.LineAccent]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineAccent);
        return '#4963E6'; // GraphAccent
    },
    get [ColorVariants.LineNegative]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineNegative);
        return '#E71717'; // GraphNegative
    },
    get [ColorVariants.LinePositive]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LinePositive);
        return '#36C05C'; // GraphPositive
    },
};

export const LightTheme: Theme & Theme = {
    ...StaticTheme,
    ...LightThemeDeprecated,
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

    /** Legacy colors */
    [ColorVariants.LineOverlayDark]: 'rgba(255,255,255,.08)',
    [ColorVariants.LineOverlayLight]: 'rgba(0,0,0,.04)',
    [ColorVariants.IconAccent]: '#0073C4',
    [ColorVariants.IconSecondary]: '#707376',
    [ColorVariants.IconNeutral]: '#E2E3E4',
};

export const DarkThemeDeprecated = {
    get [ColorVariants.LinePrimary]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LinePrimary);
        return '#20262A'; // GraphPrimaryInverted
    },
    get [ColorVariants.LineSecondary]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineSecondary);
        return '#20262A'; // GraphPrimaryInverted
    },
    get [ColorVariants.LineTertiary]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineTertiary);
        return '#20262A'; // GraphPrimaryInverted
    },
    get [ColorVariants.LineNeutral]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineNeutral);
        return '#3B4043'; // GraphNeutral
    },
    get [ColorVariants.LineAccent]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineAccent);
        return '#4963E6'; // GraphAccent
    },
    get [ColorVariants.LineNegative]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LineNegative);
        return '#4963E6'; // GraphNegative
    },
    get [ColorVariants.LinePositive]() {
        warnAboutDeprecatedColorVariant(ColorVariants.LinePositive);
        return '#36C05C'; // GraphPositive
    },
};

export const DarkTheme: Theme & Theme = {
    ...StaticTheme,
    ...DarkThemeDeprecated,
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

    /** Legacy colors */
    [ColorVariants.LineOverlayDark]: 'rgba(0,0,0,.08)',
    [ColorVariants.LineOverlayLight]: 'rgba(255,255,255,.08)',
    [ColorVariants.IconAccent]: '#0073C4',
    [ColorVariants.IconSecondary]: '#ADB0B1',
    [ColorVariants.IconNeutral]: '#3B4043',
};

export const ThemeContext = React.createContext(LightTheme);

export function useTheme() {
    return React.useContext(ThemeContext);
}
