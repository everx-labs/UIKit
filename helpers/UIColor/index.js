// @flow
import { StyleSheet } from 'react-native';

const PRIMARY_MINUS = '#47A9DA';
const PRIMARY = '#0088CC';
const PRIMARY_PLUS = '#007AB8';
const PRIMARY_1 = '#C5E4F3';
const PRIMARY_2 = '#A2D4EC';
const PRIMARY_3 = '#7AC1E4';
const PRIMARY_4 = '#006BA1';
const PRIMARY_5 = '#005885';
const PRIMARY_6 = '#003F5E';
const SECONDARY = '#FFFFFF';
const TERTIARY = '#FFFFFF';
const BLACK = '#000000';
const BLACK_LIGHT = '#2B3338';
const WHITE = '#FFFFFF';
const FA = '#FAFAFA';
const DARK = '#102027';
const GREY = '#727C81';
const GREY_1 = '#EBEDEE';
const GREY_2 = '#DDE1E2';
const GREY_3 = '#CED3D6';
const LIGHT = '#CFD8DC';
const NOT_WHITE = '#F8F9F9';
const BLACK_80 = 'rgba(0,0,0,0.8)';
const WHITE_40 = 'rgba(255,255,255,0.4)';
const WHITE_80 = 'rgba(255,255,255,0.8)';
const SUCCESS = '#27AE60';
const WARNING = '#F2C94C';
const ERROR = '#EB5757';

const TEXT_LPRIMARY = '#000000';
const TEXT_DPRIMARY = '#FFFFFF';
const TEXT_LPARAGRAPH = '#000000';
const TEXT_DPARAGRAPH = '#FFFFFF';
const TEXT_LSECONDARY = '#364046';
const TEXT_DSECONDARY = '#EBEDEE';
const TEXT_LTERTIARY = '#96A1A7';
const TEXT_DTERTIARY = '#BEC4C8';
const TEXT_LQUARTERNARY = '#BEC4C8';
const TEXT_DQUARTERNARY = '#96A1A7';
const TEXT_LCAUTION = '#FF9800';
const TEXT_DCAUTION = '#FF9800';

const BACKGROUND_LPRIMARY = '#FFFFFF';
const BACKGROUND_DPRIMARY = '#263238';
const BACKGROUND_LSECONDARY = '#FAFAFA';
const BACKGROUND_DSECONDARY = '#232E33';
const BACKGROUND_LTERTIARY = '#CFD8DC';
const BACKGROUND_DTERTIARY = '#2F3D45';
const BACKGROUND_LQUARTER = '#E7EBED';
const BACKGROUND_DQUARTER = '#5A7684';
const BACKGROUND_LQUINARY = '#F3F5F6';
const BACKGROUND_DQUINARY = '#85AFC4';
const BACKGROUND_LWHITELIGHT = '#F5F5F5';
const BACKGROUND_DWHITELIGHT = '#F5F5F5';

const BACKGROUND_SEPARATOR_CHAT = '#9FA6A9';

const HUE_005D8C = '#005D8C';
const HUE_00334C = '#00334C';
const HUE_0090D9 = '#0090D9';
const HUE_0077B2 = '#0077B2';

const OVERLAY_60 = 'rgba(16, 32, 39, 0.6)';
const OVERLAY_40 = 'rgba(16, 32, 39, 0.4)';
const OVERLAY_20 = 'rgba(16, 32, 39, 0.2)';
const OVERLAY_0 = 'rgba(16, 32, 39, 0)';

const UNCONFIRMED_PASSPORT = '#FF9800';
const WALLET_VERSION = '#BEC4C8';

const UIColorDefaultAvatar =
    [
        '#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#1E88E5', '#0288D1',
        '#0097A7', '#009688', '#43A047', '#558B2F', '#F4511E', '#8D6E63', '#78909C',
    ];

const colorStyleSheets = {
    color: {},
    backgroundColor: {},
    borderBottomColor: {},
    tintColor: {},
};

const UIColorThemeName = {
    light: 'light',
    dark: 'dark',
    action: 'action',
};

export type UIColorThemeNameType = ('light' | 'dark' | 'action');

export type UIColorData = string;

export type UIColorThemeData = {
    borderBottom: {
        normal: UIColorData,
        focused: UIColorData,
    },
    text: {
        primary: {
            normal: UIColorData,
            disabled: UIColorData,
            tapped: UIColorData,
            hover: UIColorData,
        },
        secondary: UIColorData,
        tertiary: UIColorData,
        quaternary: UIColorData,
        action: UIColorData,
        paragraph: UIColorData,
        caution: UIColorData,
        placeholder: UIColorData,
    },
    background: {
        primary: UIColorData,
        secondary: UIColorData,
        tertiary: UIColorData,
        quarter: UIColorData,
        quinary: UIColorData,
        whiteLight: UIColorData,
    },
    button: {
        background: {
            normal: UIColorData,
            tapped: UIColorData,
            hover: UIColorData,
        },
        title: {
            normal: UIColorData,
            disabled: UIColorData,
        },
    },
    detailsInput: {
        comment: UIColorData,
    },
}

const lightTheme: UIColorThemeData = {
    borderBottom: {
        normal: LIGHT,
        focused: PRIMARY,
    },
    text: {
        primary: {
            normal: TEXT_LPRIMARY,
            disabled: TEXT_LSECONDARY,
            tapped: PRIMARY_5,
            hover: PRIMARY_4,
        },
        secondary: TEXT_LSECONDARY,
        tertiary: TEXT_LTERTIARY,
        quaternary: TEXT_LQUARTERNARY,
        action: PRIMARY,
        paragraph: TEXT_LPARAGRAPH,
        caution: TEXT_LCAUTION,
        placeholder: TEXT_LTERTIARY,
    },
    background: {
        primary: BACKGROUND_LPRIMARY,
        secondary: BACKGROUND_LSECONDARY,
        tertiary: BACKGROUND_LTERTIARY,
        quarter: BACKGROUND_LQUARTER,
        quinary: BACKGROUND_LQUINARY,
        whiteLight: BACKGROUND_LWHITELIGHT,
    },
    button: {
        background: {
            normal: PRIMARY,
            tapped: PRIMARY_5,
            hover: PRIMARY_4,
        },
        title: {
            normal: WHITE,
            disabled: LIGHT,
        },
    },
    detailsInput: {
        comment: ERROR,
    },
};

const darkTheme: UIColorThemeData = {
    borderBottom: {
        normal: LIGHT,
        focused: PRIMARY,
    },
    text: {
        primary: {
            normal: TEXT_DPRIMARY,
            disabled: TEXT_DSECONDARY,
            tapped: PRIMARY_2,
            hover: PRIMARY_1,
        },
        secondary: TEXT_DSECONDARY,
        tertiary: TEXT_DTERTIARY,
        quaternary: TEXT_DQUARTERNARY,
        action: WHITE,
        paragraph: TEXT_DPARAGRAPH,
        caution: TEXT_DCAUTION,
        placeholder: WHITE_40,
    },
    background: {
        primary: BACKGROUND_DPRIMARY,
        secondary: BACKGROUND_DSECONDARY,
        tertiary: BACKGROUND_DTERTIARY,
        quarter: BACKGROUND_DQUARTER,
        quinary: BACKGROUND_DQUINARY,
        whiteLight: BACKGROUND_DWHITELIGHT,
    },
    button: {
        background: {
            normal: PRIMARY,
            tapped: PRIMARY_5,
            hover: PRIMARY_4,
        },
        title: {
            normal: WHITE,
            disabled: LIGHT,
        },
    },
    detailsInput: {
        comment: WHITE,
    },
};

const actionTheme: UIColorThemeData = {
    borderBottom: {
        normal: PRIMARY_MINUS,
        focused: PRIMARY_3,
    },
    text: {
        primary: {
            normal: TEXT_DPRIMARY,
            disabled: TEXT_DSECONDARY,
            tapped: PRIMARY_2,
            hover: PRIMARY_1,
        },
        secondary: TEXT_DSECONDARY,
        tertiary: PRIMARY_3,
        quaternary: TEXT_DQUARTERNARY,
        action: WHITE,
        paragraph: TEXT_DPARAGRAPH,
        caution: TEXT_DCAUTION,
        placeholder: WHITE_40,
    },
    background: {
        primary: BACKGROUND_DPRIMARY,
        secondary: BACKGROUND_DSECONDARY,
        tertiary: BACKGROUND_DTERTIARY,
        quarter: PRIMARY_PLUS,
        quinary: BACKGROUND_DQUINARY,
        whiteLight: BACKGROUND_DWHITELIGHT,
    },
    button: {
        background: {
            normal: PRIMARY_PLUS,
            tapped: PRIMARY_6,
            hover: PRIMARY_4,
        },
        title: {
            normal: GREY_1,
            disabled: PRIMARY,
        },
    },
    detailsInput: {
        comment: WHITE,
    },
};

const themes: { [UIColorThemeNameType]: UIColorThemeData } = {
    light: lightTheme,
    dark: darkTheme,
    action: actionTheme,
};

const current = UIColorThemeName.light;

export default class UIColor {
    static Theme = {
        Light: UIColorThemeName.light,
        Dark: UIColorThemeName.dark,
        Action: UIColorThemeName.action,
    };

    static Styles = {
        Color: 'color',
        BackgroundColor: 'backgroundColor',
        BorderBottomColor: 'borderBottomColor',
        TintColor: 'tintColor',
    };

    // Base colors
    static primaryMinus() {
        return PRIMARY_MINUS;
    }

    static primary() {
        return PRIMARY;
    }

    static primaryPlus() {
        return PRIMARY_PLUS;
    }

    static primary1() {
        return PRIMARY_1;
    }

    static primary2() {
        return PRIMARY_2;
    }

    static primary3() {
        return PRIMARY_3;
    }

    static primary4() {
        return PRIMARY_4;
    }

    static primary5() {
        return PRIMARY_5;
    }

    static primary6() {
        return PRIMARY_6;
    }

    static secondary() {
        return SECONDARY;
    }

    static tertiary() {
        return TERTIARY;
    }

    static black() {
        return BLACK;
    }

    static blackLight() {
        return BLACK_LIGHT;
    }

    static white() {
        return WHITE;
    }

    static fa() {
        return FA;
    }

    static dark() {
        return DARK;
    }

    static grey() {
        return GREY;
    }

    static grey1() {
        return GREY_1;
    }

    static grey2() {
        return GREY_2;
    }

    static grey3() {
        return GREY_3;
    }

    static msgSeparator() {
        return BACKGROUND_SEPARATOR_CHAT;
    }

    static light() {
        return LIGHT;
    }

    static notWhite() {
        return NOT_WHITE;
    }

    static black80() {
        return BLACK_80;
    }

    static white40() {
        return WHITE_40;
    }

    static white80() {
        return WHITE_80;
    }

    static success() {
        return SUCCESS;
    }

    static warning() {
        return WARNING;
    }

    static error() {
        return ERROR;
    }

    // Text colors
    static textPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.primary.normal;
    }

    static textPrimaryStyle(theme?: ?UIColorThemeNameType) {
        return UIColor.getColorStyle(UIColor.textPrimary(theme));
    }

    static stateTextPrimary(
        theme: ?UIColorThemeNameType,
        disabled: boolean,
        tapped: boolean,
        hover: boolean,
    ): UIColorData {
        const primary = themes[theme || current].text.primary;
        if (disabled) {
            return primary.disabled;
        }
        if (tapped) {
            return primary.tapped;
        }
        if (hover) {
            return primary.hover;
        }
        return primary.normal;
    }

    static stateTextPrimaryStyle(
        theme: ?UIColorThemeNameType,
        disabled: boolean,
        tapped: boolean,
        hover: boolean,
    ) {
        const color = UIColor.stateTextPrimary(theme, disabled, tapped, hover);
        return UIColor.getColorStyle(color);
    }

    static actionTextPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.action;
    }

    static actionTextPrimaryStyle(theme?: ?UIColorThemeNameType) {
        return UIColor.getColorStyle(UIColor.actionTextPrimary(theme));
    }

    static textParagraph(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.paragraph;
    }

    static textSecondary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.secondary;
    }

    static textTertiary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.tertiary;
    }

    static textTertiaryStyle(theme?: ?UIColorThemeNameType) {
        return UIColor.getColorStyle(UIColor.textTertiary(theme));
    }

    static textQuaternary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.quaternary;

    }

    static textCaution(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.caution;
    }

    static textPlaceholder(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.placeholder;
    }

    // Background colors
    static backgroundPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.primary;
    }

    static backgroundSecondary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.secondary;
    }

    static backgroundTertiary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.tertiary;
    }

    static backgroundQuarter(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.quarter;
    }

    static backgroundQuinary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.quinary;
    }

    static backgroundWhiteLight(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.whiteLight;
    }

    // border
    static borderBottomColor(theme: ?UIColorThemeNameType, focused: boolean): UIColorData {
        const borderBottom = themes[theme || current].borderBottom;
        return focused ? borderBottom.focused : borderBottom.normal;
    }

    static borderBottomColorStyle(theme: ?UIColorThemeNameType, focused: boolean) {
        const borderColor = UIColor.borderBottomColor(theme, focused);
        return UIColor.getBorderBottomColorStyle(borderColor);
    }

    // component colors
    static buttonBackground(
        theme: ?UIColorThemeNameType,
        tapped: boolean,
        hover: boolean,
    ): UIColorData {
        const background = themes[theme || current].button.background;
        if (tapped) {
            return background.tapped;
        }
        if (hover) {
            return background.hover;
        }
        return background.normal;
    }

    static buttonTitle(theme: ?UIColorThemeNameType, disabled: boolean): UIColorData {
        const title = themes[theme || current].button.title;
        return disabled ? title.disabled : title.normal;
    }

    static detailsInputComment(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].detailsInput.comment;
    }

    // Hue colors
    static hue005D8C() {
        return HUE_005D8C;
    }

    static hue00334C() {
        return HUE_00334C;
    }

    static hue0090D9() {
        return HUE_0090D9;
    }

    static hue0077B2() {
        return HUE_0077B2;
    }

    // Overlays
    static overlay60() {
        return OVERLAY_60;
    }

    static overlay40() {
        return OVERLAY_40;
    }

    static overlay20() {
        return OVERLAY_20;
    }

    static overlay0() {
        return OVERLAY_0;
    }

    static overlayWithAlpha(alpha: number = 0.5) {
        return `rgba(16, 32, 39, ${alpha})`;
    }

    static defaultAvatarBackground(index: number) {
        const count = UIColorDefaultAvatar.length;
        return UIColorDefaultAvatar[index % count];
    }

    static getAvatarBackgroundColor(id: (number | string) = 0) {
        if (!id) {
            return UIColor.grey();
        }
        const colorNumber = typeof id === 'number' ? id : id.charCodeAt(0);
        return UIColor.defaultAvatarBackground(colorNumber);
    }

    // Passport
    static unconfirmedPassport() {
        return UNCONFIRMED_PASSPORT;
    }

    static walletVersion() {
        return WALLET_VERSION;
    }

    // Utility
    static getStyle(color: UIColorData, colorStyle: string) {
        const colorStyles = colorStyleSheets[colorStyle];
        if (!colorStyles) {
            return null;
        }
        let sheet = colorStyles[color];
        if (!sheet) {
            sheet = StyleSheet.create({
                style: {
                    [colorStyle]: color,
                },
            });
            colorStyles[color] = sheet;
        }
        return sheet.style;
    }

    static getColorStyle(color: UIColorData) {
        return UIColor.getStyle(color, UIColor.Styles.Color);
    }

    static getBackgroundColorStyle(color: UIColorData) {
        return UIColor.getStyle(color, UIColor.Styles.BackgroundColor);
    }

    static getBorderBottomColorStyle(color: UIColorData) {
        return UIColor.getStyle(color, UIColor.Styles.BorderBottomColor);
    }

    static getTintColorStyle(color: UIColorData) {
        return UIColor.getStyle(color, UIColor.Styles.TintColor);
    }
}
