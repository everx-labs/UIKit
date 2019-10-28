// @flow
import UIColorPalette from './UIColorPalette';
import { UIColorThemeName } from './UIColorTypes';
import UIColorThemeAction from './UIColorThemeAction';
import UIColorThemeDark from './UIColorThemeDark';
import UIColorThemeLight from './UIColorThemeLight';
import UIStyleColor from '../UIStyle/UIStyleColor';

import type {
    UIColorData,
    UIColorThemeData,
    UIColorThemeNameType,
} from './UIColorTypes';

const themes: { [UIColorThemeNameType]: UIColorThemeData } = {
    light: UIColorThemeLight,
    dark: UIColorThemeDark,
    action: UIColorThemeAction,
};

const current = UIColorThemeName.light;

export default class UIColor {
    static Theme = {
        Light: UIColorThemeName.light,
        Dark: UIColorThemeName.dark,
        Action: UIColorThemeName.action,
    };

    static palette = UIColorPalette;
    static current: UIColorThemeData = themes.light;

    // Base palette
    static primaryMinus() {
        return UIColorPalette.primaryMinus;
    }

    static primary() {
        return UIColorPalette.primary;
    }

    static primaryPlus() {
        return UIColorPalette.primaryPlus;
    }

    static primary1() {
        return UIColorPalette.primary1;
    }

    static primary2() {
        return UIColorPalette.primary2;
    }

    static primary3() {
        return UIColorPalette.primary3;
    }

    static primary4() {
        return UIColorPalette.primary4;
    }

    static primary5() {
        return UIColorPalette.primary5;
    }

    static primary6() {
        return UIColorPalette.primary6;
    }

    static primaryAlpha20() {
        return UIColorPalette.primaryAlpha20;
    }

    static secondary() {
        return UIColorPalette.secondary;
    }

    static tertiary() {
        return UIColorPalette.tertiary;
    }

    static black() {
        return UIColorPalette.black;
    }

    static blackLight() {
        return UIColorPalette.blackLight;
    }

    static white() {
        return UIColorPalette.white;
    }

    static green() {
        return UIColorPalette.green;
    }

    static yellow() {
        return UIColorPalette.yellow;
    }

    static fa() {
        return UIColorPalette.fa;
    }

    static dark() {
        return UIColorPalette.dark;
    }

    static whiteLight() {
        return UIColorPalette.whiteLight;
    }

    static grey() {
        return UIColorPalette.grey;
    }

    static grey1() {
        return UIColorPalette.grey1;
    }

    static grey2() {
        return UIColorPalette.grey2;
    }

    static grey3() {
        return UIColorPalette.grey3;
    }

    static msgSeparator() {
        return UIColorPalette.background.separatorChat;
    }

    static light() {
        return UIColorPalette.light;
    }

    static lightQuinary() {
        return UIColorPalette.background.lightQuinary;
    }

    static notWhite() {
        return UIColorPalette.notWhite;
    }

    static black80() {
        return UIColorPalette.black80;
    }

    static white20() {
        return UIColorPalette.white20;
    }

    static white40() {
        return UIColorPalette.white40;
    }

    static white80() {
        return UIColorPalette.white80;
    }

    static success() {
        return UIColorPalette.success;
    }

    static warning() {
        return UIColorPalette.warning;
    }

    static error() {
        return UIColorPalette.error;
    }

    static hue005D8C() {
        return UIColorPalette.hue005D8C;
    }

    static hue00334C() {
        return UIColorPalette.hue00334C;
    }

    static hue0090D9() {
        return UIColorPalette.hue0090D9;
    }

    static hue0077B2() {
        return UIColorPalette.hue0077B2;
    }

    static overlay60() {
        return UIColorPalette.overlay60;
    }

    static overlay40() {
        return UIColorPalette.overlay40;
    }

    static overlay20() {
        return UIColorPalette.overlay20;
    }

    static overlay0() {
        return UIColorPalette.overlay0;
    }

    // Text colors
    static textPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.primary.normal;
    }

    // deprecated, moved to UIStyleColor
    static textPrimaryStyle(theme?: ?UIColorThemeNameType) {
        return UIStyleColor.getColorStyle(UIColor.textPrimary(theme));
    }

    static stateTextPrimary(
        theme: ?UIColorThemeNameType,
        disabled: boolean,
        tapped: boolean,
        hover: boolean,
    ): UIColorData {
        const { primary } = themes[theme || current].text;
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

    // deprecated, moved to UIStyleColor
    static stateTextPrimaryStyle(
        theme: ?UIColorThemeNameType,
        disabled: boolean,
        tapped: boolean,
        hover: boolean,
    ) {
        const color = UIColor.stateTextPrimary(theme, disabled, tapped, hover);
        return UIStyleColor.getColorStyle(color);
    }

    static actionTextPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.action;
    }

    static actionTextPrimaryStyle(theme?: ?UIColorThemeNameType) {
        return UIStyleColor.getColorStyle(UIColor.actionTextPrimary(theme));
    }

    static textParagraph(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.paragraph;
    }

    static textSecondary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.secondary;
    }

    static textSecondaryStyle(theme?: ?UIColorThemeNameType) {
        return UIStyleColor.getColorStyle(UIColor.textSecondary(theme));
    }

    static textTertiary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.tertiary;
    }

    static textTertiaryStyle(theme?: ?UIColorThemeNameType) {
        return UIStyleColor.getColorStyle(UIColor.textTertiary(theme));
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
    static boderBottomLightColor(theme: ?UIColorThemeNameType) {
        const { borderBottom } = themes[theme || current];
        return borderBottom.light;
    }

    static borderBottomColor(
        theme: ?UIColorThemeNameType,
        focused: boolean,
        hover: boolean,
    ): UIColorData {
        const { borderBottom } = themes[theme || current];
        if (focused) {
            return borderBottom.focused;
        }
        if (hover) {
            return borderBottom.hover;
        }
        return borderBottom.normal;
    }

    static borderBottomColorStyle(
        theme: ?UIColorThemeNameType,
        focused: boolean,
        hover: boolean,
    ) {
        const borderColor = UIColor.borderBottomColor(theme, focused, hover);
        return UIStyleColor.getBorderBottomColorStyle(borderColor);
    }

    // component colors
    static buttonBackground(
        theme: ?UIColorThemeNameType,
        tapped: boolean,
        hover: boolean,
    ): UIColorData {
        const { background } = themes[theme || current].button;
        if (tapped) {
            return background.tapped;
        }
        if (hover) {
            return background.hover;
        }
        return background.normal;
    }

    static buttonTitle(theme: ?UIColorThemeNameType, disabled: boolean): UIColorData {
        const { title } = themes[theme || current].button;
        return disabled ? title.disabled : title.normal;
    }

    static detailsInputComment(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].detailsInput.comment;
    }

    static amountInputPlaceholder(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].detailsInput.amount.placeholder;
    }


    static overlayWithAlpha(alpha: number = 0.5) {
        return `rgba(16, 32, 39, ${alpha})`;
    }

    static defaultAvatarBackground(index: number) {
        const count = UIColorPalette.avatar.length;
        return UIColorPalette.avatar[index % count];
    }

    static getAvatarBackgroundColor(id: (number | string) = 0) {
        if (!id) {
            return UIColor.grey();
        }
        const colorNumber = typeof id === 'number' ? id : id.charCodeAt(0);
        return UIColor.defaultAvatarBackground(colorNumber);
    }

    // deprecated, moved to UIStyleColor
    static getColorStyle(color: UIColorData) {
        return UIStyleColor.getStyle(color, UIStyleColor.Styles.Color);
    }

    // deprecated, moved to UIStyleColor
    static getBackgroundColorStyle(color: UIColorData) {
        return UIStyleColor.getStyle(color, UIStyleColor.Styles.BackgroundColor);
    }

    // deprecated, moved to UIStyleColor
    static getBorderBottomColorStyle(color: UIColorData) {
        return UIStyleColor.getStyle(color, UIStyleColor.Styles.BorderBottomColor);
    }

    // deprecated, moved to UIStyleColor
    static getTintColorStyle(color: UIColorData) {
        return UIStyleColor.getStyle(color, UIStyleColor.Styles.TintColor);
    }
}
