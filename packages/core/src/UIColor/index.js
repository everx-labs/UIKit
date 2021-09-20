// @flow
import UIColorPalette from './UIColorPalette';
import { UIColorThemeName } from './UIColorTypes';
import UIStyleColor from '../UIStyle/UIStyleColor';

import type { UIColorData, UIColorThemeNameType } from './UIColorTypes';

import { UITheme } from '../UITheme';

export default class UIColor {
    static Theme = {
        Light: UIColorThemeName.light,
        Dark: UIColorThemeName.dark,
        Action: UIColorThemeName.action,
    };

    static palette = UIColorPalette;

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

    static light() {
        return UIColorPalette.light;
    }

    static lightQuinary() {
        return UIColorPalette.background.lightQuinary;
    }

    static msgSeparator() {
        return UIColorPalette.separatorChat;
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

    static caution() {
        return UIColorPalette.caution;
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

    static tagBlack() {
        return UIColorPalette.tag.black;
    }

    static tagGreen() {
        return UIColorPalette.tag.green;
    }

    static tagRed() {
        return UIColorPalette.tag.red;
    }

    static tagBlue() {
        return UIColorPalette.tag.blue;
    }

    static tagDefault() {
        return UIColorPalette.tag.default;
    }

    // Text colors
    static textPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textPrimary(theme);
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
        return UITheme.stateTextPrimary(theme, disabled, tapped, hover);
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
        return UITheme.actionTextPrimary(theme);
    }

    static actionTextPrimaryStyle(theme?: ?UIColorThemeNameType) {
        return UIStyleColor.getColorStyle(UIColor.actionTextPrimary(theme));
    }

    static textParagraph(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textParagraph(theme);
    }

    static textSecondary(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textSecondary(theme);
    }

    static textSecondaryStyle(theme?: ?UIColorThemeNameType) {
        return UIStyleColor.getColorStyle(UIColor.textSecondary(theme));
    }

    static textTertiary(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textTertiary(theme);
    }

    static textTertiaryStyle(theme?: ?UIColorThemeNameType) {
        return UIStyleColor.getColorStyle(UIColor.textTertiary(theme));
    }

    static textQuaternary(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textQuaternary(theme);
    }

    static textCaution(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textCaution(theme);
    }

    static textPlaceholder(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textPlaceholder(theme);
    }

    static textAccent(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textAccent(theme);
    }

    static textDisabled(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textDisabled(theme);
    }

    static textPositive(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textPositive(theme);
    }

    static textNegative(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.textNegative(theme);
    }

    // Background colors
    static backgroundPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundPrimary(theme);
    }

    static backgroundPrimaryInverted(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundPrimaryInverted(theme);
    }

    static backgroundSecondary(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundSecondary(theme);
    }

    static backgroundTertiary(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundTertiary(theme);
    }

    static backgroundQuarter(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundQuarter(theme);
    }

    static backgroundQuinary(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundQuinary(theme);
    }

    static backgroundWhiteLight(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundWhiteLight(theme);
    }

    static backgroundPositive(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundPositive(theme);
    }

    static backgroundNegative(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundNegative(theme);
    }

    static backgroundBrake(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.backgroundBrake(theme);
    }

    // border
    static borderBottomLightColor(theme: ?UIColorThemeNameType) {
        const borderBottom = UITheme.borderBottom(theme);
        return borderBottom.light;
    }

    static borderBottomColor(
        theme: ?UIColorThemeNameType,
        focused: boolean,
        hover: boolean,
    ): UIColorData {
        return UITheme.borderBottomColor(theme, focused, hover);
    }

    static borderBottomColorStyle(theme: ?UIColorThemeNameType, focused: boolean, hover: boolean) {
        const borderColor = UIColor.borderBottomColor(theme, focused, hover);
        return UIStyleColor.getBorderBottomColorStyle(borderColor);
    }

    // component colors
    static buttonBackground(
        theme: ?UIColorThemeNameType,
        tapped: boolean,
        hover: boolean,
    ): UIColorData {
        const { background } = UITheme.button(theme);
        if (tapped) {
            return background.tapped;
        }
        if (hover) {
            return background.hover;
        }
        return background.normal;
    }

    static buttonTitle(theme: ?UIColorThemeNameType, disabled: boolean): UIColorData {
        const { title } = UITheme.button(theme);
        return disabled ? title.disabled : title.normal;
    }

    static detailsInputComment(theme?: ?UIColorThemeNameType): UIColorData {
        return UITheme.detailsInputComment(theme);
    }

    static overlayWithAlpha(alpha: number = 0.5) {
        return `rgba(16, 32, 39, ${alpha})`;
    }

    static defaultAvatarBackground(index: number) {
        const count = UIColorPalette.avatar.length;
        return UIColorPalette.avatar[index % count];
    }

    static getAvatarBackgroundColor(id: number | string = 0) {
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

    static switchCurrentTheme(themeName: UIColorThemeNameType) {
        UITheme.switchCurrentTheme(themeName);
    }
}
