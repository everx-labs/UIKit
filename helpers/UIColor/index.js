import { StyleSheet } from 'react-native';

const UI_COLOR_PRIMARY_MINUS = '#47A9DA';
const UI_COLOR_PRIMARY = '#0088CC';
const UI_COLOR_PRIMARY_PLUS = '#007AB8';
const UI_COLOR_PRIMARY_1 = '#C5E4F3';
const UI_COLOR_PRIMARY_2 = '#A2D4EC';
const UI_COLOR_PRIMARY_3 = '#7AC1E4';
const UI_COLOR_PRIMARY_4 = '#006BA1';
const UI_COLOR_PRIMARY_5 = '#005885';
const UI_COLOR_PRIMARY_6 = '#003F5E';
const UI_COLOR_SECONDARY = '#FFFFFF';
const UI_COLOR_TERTIARY = '#FFFFFF';
const UI_COLOR_BLACK = '#000000';
const UI_COLOR_BLACK_LIGHT = '#2B3338';
const UI_COLOR_WHITE = '#FFFFFF';
const UI_COLOR_FA = '#FAFAFA';
const UI_COLOR_DARK = '#102027';
const UI_COLOR_GREY = '#727C81';
const UI_COLOR_GREY_1 = '#EBEDEE';
const UI_COLOR_GREY_2 = '#DDE1E2';
const UI_COLOR_GREY_3 = '#CED3D6';
const UI_COLOR_LIGHT = '#CFD8DC';
const UI_COLOR_NOT_WHITE = '#F8F9F9';
const UI_COLOR_BLACK_80 = 'rgba(0,0,0,0.8)';
const UI_COLOR_WHITE_40 = 'rgba(255,255,255,0.4)';
const UI_COLOR_WHITE_80 = 'rgba(255,255,255,0.8)';
const UI_COLOR_SUCCESS = '#27AE60';
const UI_COLOR_WARNING = '#F2C94C';
const UI_COLOR_ERROR = '#EB5757';

const UI_COLOR_TEXT_LPRIMARY = '#000000';
const UI_COLOR_TEXT_DPRIMARY = '#FFFFFF';
const UI_COLOR_TEXT_LPARAGRAPH = '#000000';
const UI_COLOR_TEXT_DPARAGRAPH = '#FFFFFF';
const UI_COLOR_TEXT_LSECONDARY = '#364046';
const UI_COLOR_TEXT_DSECONDARY = '#DADADA';
const UI_COLOR_TEXT_LTERTIARY = '#96A1A7';
const UI_COLOR_TEXT_DTERTIARY = '#BEC4C8';
const UI_COLOR_TEXT_LQUARTERNARY = '#BEC4C8';
const UI_COLOR_TEXT_DQUARTERNARY = '#96A1A7';

const UI_COLOR_TEXT_LTCAUTION = '#FF9800';
const UI_COLOR_TEXT_DTCAUTION = '#FF9800';

const UI_COLOR_BACKGROUND_LPRIMARY = '#FFFFFF';
const UI_COLOR_BACKGROUND_DPRIMARY = '#263238';
const UI_COLOR_BACKGROUND_LSECONDARY = '#FAFAFA';
const UI_COLOR_BACKGROUND_DSECONDARY = '#232E33';
const UI_COLOR_BACKGROUND_LTERTIARY = '#CFD8DC';
const UI_COLOR_BACKGROUND_DTERTIARY = '#2F3D45';
const UI_COLOR_BACKGROUND_LQUARTER = '#E7EBED';
const UI_COLOR_BACKGROUND_DQUARTER = '#5A7684';
const UI_COLOR_BACKGROUND_LQUINARY = '#F3F5F6';
const UI_COLOR_BACKGROUND_DQUINARY = '#85AFC4';

const UI_COLOR_BACKGROUND_SEPARATOR_CHAT = '#9FA6A9';

const UI_COLOR_HUE_005D8C = '#005D8C';
const UI_COLOR_HUE_00334C = '#00334C';
const UI_COLOR_HUE_0090D9 = '#0090D9';
const UI_COLOR_HUE_0077B2 = '#0077B2';

const UI_COLOR_OVERLAY_60 = 'rgba(16, 32, 39, 0.6)';
const UI_COLOR_OVERLAY_40 = 'rgba(16, 32, 39, 0.4)';
const UI_COLOR_OVERLAY_20 = 'rgba(16, 32, 39, 0.2)';
const UI_COLOR_OVERLAY_0 = 'rgba(16, 32, 39, 0)';

const UI_COLOR_UNCONFIRMED_PASSPORT = '#FF9800';
const UI_COLOR_WALLET_VERSION = '#BEC4C8';

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

export default class UIColor {
    static Theme = {
        Light: 'light',
        Dark: 'dark',
    };

    static Styles = {
        Color: 'color',
        BackgroundColor: 'backgroundColor',
        BorderBottomColor: 'borderBottomColor',
        TintColor: 'tintColor',
    };

    // Base colors
    static primaryMinus() {
        return UI_COLOR_PRIMARY_MINUS;
    }

    static primary() {
        return UI_COLOR_PRIMARY;
    }

    static primaryPlus() {
        return UI_COLOR_PRIMARY_PLUS;
    }

    static primary1() {
        return UI_COLOR_PRIMARY_1;
    }

    static primary2() {
        return UI_COLOR_PRIMARY_2;
    }

    static primary3() {
        return UI_COLOR_PRIMARY_3;
    }

    static primary4() {
        return UI_COLOR_PRIMARY_4;
    }

    static primary5() {
        return UI_COLOR_PRIMARY_5;
    }

    static primary6() {
        return UI_COLOR_PRIMARY_6;
    }

    static secondary() {
        return UI_COLOR_SECONDARY;
    }

    static tertiary() {
        return UI_COLOR_TERTIARY;
    }

    static black() {
        return UI_COLOR_BLACK;
    }

    static blackLight() {
        return UI_COLOR_BLACK_LIGHT;
    }

    static white() {
        return UI_COLOR_WHITE;
    }

    static fa() {
        return UI_COLOR_FA;
    }

    static dark() {
        return UI_COLOR_DARK;
    }

    static grey() {
        return UI_COLOR_GREY;
    }

    static grey1() {
        return UI_COLOR_GREY_1;
    }

    static grey2() {
        return UI_COLOR_GREY_2;
    }

    static grey3() {
        return UI_COLOR_GREY_3;
    }

    static msgSeparator() {
        return UI_COLOR_BACKGROUND_SEPARATOR_CHAT;
    }

    static light() {
        return UI_COLOR_LIGHT;
    }

    static notWhite() {
        return UI_COLOR_NOT_WHITE;
    }

    static black80() {
        return UI_COLOR_BLACK_80;
    }

    static white40() {
        return UI_COLOR_WHITE_40;
    }

    static white80() {
        return UI_COLOR_WHITE_80;
    }

    static success() {
        return UI_COLOR_SUCCESS;
    }

    static warning() {
        return UI_COLOR_WARNING;
    }

    static error() {
        return UI_COLOR_ERROR;
    }

    // Text colors
    static textPrimary(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_TEXT_LPRIMARY;
        }
        return UI_COLOR_TEXT_DPRIMARY;
    }

    static stateTextPrimary(theme, disabled, tapped, hover) {
        if (disabled) {
            return UIColor.textSecondary(theme);
        }
        if (tapped) {
            if (theme === UIColor.Theme.Light) {
                return UIColor.primary5();
            }
            return UIColor.primary2();
        }
        if (hover) {
            if (theme === UIColor.Theme.Light) {
                return UIColor.primary4();
            }
            return UIColor.primary1();
        }
        return null;
    }

    static stateTextPrimaryStyle(theme, disabled, tapped, hover) {
        const color = UIColor.stateTextPrimary(theme, disabled, tapped, hover);
        return color ? UIColor.getColorStyle(color) : null;
    }

    static actionTextPrimary(theme) {
        if (theme === UIColor.Theme.Light) {
            return UIColor.primary();
        }
        return UIColor.white();
    }

    static actionTextPrimaryStyle(theme) {
        const color = UIColor.actionTextPrimary(theme);
        return UIColor.getColorStyle(color);
    }

    static textParagraph(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_TEXT_LPARAGRAPH;
        }
        return UI_COLOR_TEXT_DPARAGRAPH;
    }

    static textSecondary(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_TEXT_LSECONDARY;
        }
        return UI_COLOR_TEXT_DSECONDARY;
    }

    static textTertiary(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_TEXT_LTERTIARY;
        }
        return UI_COLOR_TEXT_DTERTIARY;
    }

    static textQuaternary(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_TEXT_LQUARTERNARY;
        }
        return UI_COLOR_TEXT_DQUARTERNARY;
    }

    static textCaution(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_TEXT_LTCAUTION;
        }
        return UI_COLOR_TEXT_DTCAUTION;
    }

    // Background colors
    static backgroundPrimary(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_BACKGROUND_LPRIMARY;
        }
        return UI_COLOR_BACKGROUND_DPRIMARY;
    }

    static backgroundSecondary(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_BACKGROUND_LSECONDARY;
        }
        return UI_COLOR_BACKGROUND_DSECONDARY;
    }

    static backgroundTertiary(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_BACKGROUND_LTERTIARY;
        }
        return UI_COLOR_BACKGROUND_DTERTIARY;
    }

    static backgroundQuarter(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_BACKGROUND_LQUARTER;
        }
        return UI_COLOR_BACKGROUND_DQUARTER;
    }

    static backgroundQuinary(theme = UIColor.Theme.Light) {
        if (theme === UIColor.Theme.Light) {
            return UI_COLOR_BACKGROUND_LQUINARY;
        }
        return UI_COLOR_BACKGROUND_DQUINARY;
    }

    // Hue colors
    static hue005D8C() {
        return UI_COLOR_HUE_005D8C;
    }

    static hue00334C() {
        return UI_COLOR_HUE_00334C;
    }

    static hue0090D9() {
        return UI_COLOR_HUE_0090D9;
    }

    static hue0077B2() {
        return UI_COLOR_HUE_0077B2;
    }

    // Overlays
    static overlay60() {
        return UI_COLOR_OVERLAY_60;
    }

    static overlay40() {
        return UI_COLOR_OVERLAY_40;
    }

    static overlay20() {
        return UI_COLOR_OVERLAY_20;
    }

    static overlay0() {
        return UI_COLOR_OVERLAY_0;
    }

    static overlayWithAlpha(alpha = 0.5) {
        return `rgba(16, 32, 39, ${alpha})`;
    }

    static defaultAvatarBackground(index) {
        const count = UIColorDefaultAvatar.length;
        return UIColorDefaultAvatar[index % count];
    }

    static getAvatarBackgroundColor(id = 0) {
        if (!id) {
            return UIColor.grey();
        }
        const colorNumber = typeof id === 'number' ? id : id.charCodeAt(0);
        return UIColor.defaultAvatarBackground(colorNumber);
    }

    // Passport
    static unconfirmedPassport() {
        return UI_COLOR_UNCONFIRMED_PASSPORT;
    }

    static walletVersion() {
        return UI_COLOR_WALLET_VERSION;
    }

    static getStyle(color, colorStyle) {
        let sheet = colorStyleSheets[colorStyle][color];
        if (!sheet) {
            sheet = StyleSheet.create({
                style: {
                    [colorStyle]: color,
                },
            });
            colorStyleSheets[colorStyle][color] = sheet;
        }
        return sheet.style;
    }

    static getColorStyle(color) {
        return UIColor.getStyle(color, UIColor.Styles.Color);
    }

    static getBackgroundColorStyle(color) {
        return UIColor.getStyle(color, UIColor.Styles.BackgroundColor);
    }

    static getBorderBottomColorStyle(color) {
        return UIColor.getStyle(color, UIColor.Styles.BorderBottomColor);
    }

    static getTintColorStyle(color) {
        return UIColor.getStyle(color, UIColor.Styles.TintColor);
    }
}
