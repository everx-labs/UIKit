import { UIColorThemeName } from '../UIColor/UIColorTypes';
import UIColorThemeAction from '../UIColor/UIColorThemeAction';
import UIColorThemeDark from '../UIColor/UIColorThemeDark';
import UIColorThemeLight from '../UIColor/UIColorThemeLight';
import type { UIColorData, UIColorThemeData, UIColorThemeNameType } from '../UIColor/UIColorTypes';

const themes: { [UIColorThemeNameType]: UIColorThemeData } = {
    light: UIColorThemeLight,
    dark: UIColorThemeDark,
    action: UIColorThemeAction,
};

let current = UIColorThemeName.light;

export class UITheme {
    static current: UIColorThemeData = themes.light;

    static switchCurrentTheme(themeName: UIColorThemeNameType) {
        current = themeName;
        this.current = themes[themeName];
    }

    // Text colors
    static textPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.primary.normal;
    }

    static stateTextPrimary(
        theme: ?UIColorThemeNameType,
        disabled: boolean,
        tapped: boolean,
        hover: boolean,
    ): UIColorData {
        const primary = UITheme.textPrimary(theme);
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

    static actionTextPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.action;
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

    static textQuaternary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.quaternary;
    }

    static textCaution(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.caution;
    }

    static textPlaceholder(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.placeholder;
    }

    static textAccent(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.accent;
    }

    static textDisabled(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].detailsInput.amount.placeholder;
    }

    static textPositive(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.positive;
    }

    static textNegative(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.negative;
    }

    // Background colors
    static backgroundPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.primary;
    }

    static backgroundPrimaryInverted(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.primaryInverted;
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

    static backgroundPositive(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.positive;
    }

    static backgroundNegative(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.negative;
    }

    static backgroundBrake(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].background.brake;
    }

    static borderBottom(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].borderBottom;
    }

    static borderBottomColor(
        theme: ?UIColorThemeNameType,
        focused: boolean,
        hover: boolean,
    ): UIColorData {
        const borderBottom = UITheme.borderBottom(theme);
        if (focused) {
            return borderBottom.focused;
        }
        if (hover) {
            return borderBottom.hover;
        }
        return borderBottom.normal;
    }

    static borderBottomLightColor(theme: ?UIColorThemeNameType) {
        const borderBottom = UITheme.borderBottom(theme);
        return borderBottom.light;
    }

    static button(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].button;
    }

    static detailsInputComment(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].detailsInput.comment;
    }
}
