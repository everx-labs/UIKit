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

    // Text colors
    static textPrimary(theme?: ?UIColorThemeNameType): UIColorData {
        return themes[theme || current].text.primary.normal;
    }

    // Background colors
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
}
