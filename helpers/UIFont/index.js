import { Platform } from 'react-native';

const UI_FONT_FAMILY = {
    fontFamily: Platform.select({ web: 'IBM Plex Sans' }),
    ...Platform.select({
        android: {
            textShadowRadius: 0, // Disable Text Shadow Globally as it's broken for Android started RN0.57.2: https://github.com/facebook/react-native/issues/21507
        },
    }),
};

// const UI_FONT_THIN = { fontWeight: '100' };
// const UI_FONT_ULTRA_LIGHT = { fontWeight: '200' };
const UI_FONT_LIGHT = { fontWeight: '300' };
const UI_FONT_REGULAR = { fontWeight: '400' };
const UI_FONT_MEDIUM = { fontWeight: '500' };
// const UI_FONT_SEMIBOLD = { fontWeight: '600' };
const UI_FONT_BOLD = { fontWeight: '700' };
// const UI_FONT_HEAVY = { fontWeight: '800' };
// const UI_FONT_BLACK = { fontWeight: '900' };

const UI_FONT_KEY = {
    fontSize: 96,
    lineHeight: 128,
    letterSpacing: -1.5,
    ...UI_FONT_FAMILY,
};
const UI_FONT_HEADLINE = {
    fontSize: 64,
    lineHeight: 84,
    letterSpacing: -0.5,
    ...UI_FONT_FAMILY,
};
const UI_FONT_SUBHEAD = {
    fontSize: 48,
    lineHeight: 64,
    letterSpacing: 0,
    ...UI_FONT_FAMILY,
};
const UI_FONT_TITLE = {
    fontSize: 36,
    lineHeight: 48,
    letterSpacing: 0.25,
    ...UI_FONT_FAMILY,
};
const UI_FONT_SUBTITLE = {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    ...UI_FONT_FAMILY,
};
const UI_FONT_ACCENT = {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.15,
    ...UI_FONT_FAMILY,
};
const UI_FONT_BODY = {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.5,
    ...UI_FONT_FAMILY,
};
const UI_FONT_SMALL = {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.25,
    ...UI_FONT_FAMILY,
};
const UI_FONT_CAPTION = {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.75,
    ...UI_FONT_FAMILY,
};
const UI_FONT_TINY = {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    ...UI_FONT_FAMILY,
};
const UI_FONT_MENU = {
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 2,
    ...UI_FONT_FAMILY,
};
const UI_FONT_ICON = {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.2,
    ...UI_FONT_FAMILY,
};

const UI_FONT_KEY_BOLD = { ...UI_FONT_KEY, ...UI_FONT_BOLD };
const UI_FONT_KEY_LIGHT = { ...UI_FONT_KEY, ...UI_FONT_LIGHT };
const UI_FONT_HEADLINE_BOLD = { ...UI_FONT_HEADLINE, ...UI_FONT_BOLD };
const UI_FONT_HEADLINE_LIGHT = { ...UI_FONT_HEADLINE, ...UI_FONT_LIGHT };
const UI_FONT_SUBHEAD_BOLD = { ...UI_FONT_SUBHEAD, ...UI_FONT_BOLD };
const UI_FONT_SUBHEAD_LIGHT = { ...UI_FONT_LIGHT, ...UI_FONT_LIGHT };
const UI_FONT_TITLE_BOLD = { ...UI_FONT_TITLE, ...UI_FONT_BOLD };
const UI_FONT_TITLE_REGULAR = { ...UI_FONT_TITLE, ...UI_FONT_REGULAR };
const UI_FONT_TITLE_LIGHT = { ...UI_FONT_TITLE, ...UI_FONT_LIGHT };
const UI_FONT_SUBTITLE_BOLD = { ...UI_FONT_SUBTITLE, ...UI_FONT_BOLD };
const UI_FONT_SUBTITLE_REGULAR = { ...UI_FONT_SUBTITLE, ...UI_FONT_REGULAR };
const UI_FONT_SUBTITLE_LIGHT = { ...UI_FONT_SUBTITLE, ...UI_FONT_LIGHT };
const UI_FONT_ACCENT_BOLD = { ...UI_FONT_ACCENT, ...UI_FONT_BOLD };
const UI_FONT_ACCENT_REGULAR = { ...UI_FONT_ACCENT, ...UI_FONT_REGULAR };
const UI_FONT_ACCENT_MEDIUM = { ...UI_FONT_ACCENT, ...UI_FONT_MEDIUM };
const UI_FONT_BODY_BOLD = { ...UI_FONT_BODY, ...UI_FONT_BOLD };
const UI_FONT_BODY_REGULAR = { ...UI_FONT_BODY, ...UI_FONT_REGULAR };
const UI_FONT_BODY_MEDIUM = { ...UI_FONT_BODY, ...UI_FONT_MEDIUM };
const UI_FONT_SMALL_BOLD = { ...UI_FONT_SMALL, ...UI_FONT_BOLD };
const UI_FONT_SMALL_REGULAR = { ...UI_FONT_SMALL, ...UI_FONT_REGULAR };
const UI_FONT_SMALL_MEDIUM = { ...UI_FONT_SMALL, ...UI_FONT_MEDIUM };
const UI_FONT_CAPTION_BOLD = { ...UI_FONT_CAPTION, ...UI_FONT_BOLD };
const UI_FONT_CAPTION_REGULAR = { ...UI_FONT_CAPTION, ...UI_FONT_REGULAR };
const UI_FONT_CAPTION_MEDIUM = { ...UI_FONT_CAPTION, ...UI_FONT_MEDIUM };
const UI_FONT_TINY_BOLD = { ...UI_FONT_TINY, ...UI_FONT_BOLD };
const UI_FONT_TINY_REGULAR = { ...UI_FONT_TINY, ...UI_FONT_REGULAR };
const UI_FONT_TINY_MEDIUM = { ...UI_FONT_TINY, ...UI_FONT_MEDIUM };
const UI_FONT_MENU_BOLD = { ...UI_FONT_MENU, ...UI_FONT_BOLD };
const UI_FONT_MENU_REGULAR = { ...UI_FONT_MENU, ...UI_FONT_REGULAR };
const UI_FONT_ICON_BOLD = { ...UI_FONT_ICON, ...UI_FONT_BOLD };
const UI_FONT_ICON_REGULAR = { ...UI_FONT_ICON, ...UI_FONT_REGULAR };

export default class UIFont {
    static keyBold() {
        return UI_FONT_KEY_BOLD;
    }

    static keyLight() {
        return UI_FONT_KEY_LIGHT;
    }

    static headlineBold() {
        return UI_FONT_HEADLINE_BOLD;
    }

    static headlineLight() {
        return UI_FONT_HEADLINE_LIGHT;
    }

    static subheadBold() {
        return UI_FONT_SUBHEAD_BOLD;
    }

    static subheadLight() {
        return UI_FONT_SUBHEAD_LIGHT;
    }

    static titleBold() {
        return UI_FONT_TITLE_BOLD;
    }

    static titleRegular() {
        return UI_FONT_TITLE_REGULAR;
    }

    static titleLight() {
        return UI_FONT_TITLE_LIGHT;
    }

    static subtitleBold() {
        return UI_FONT_SUBTITLE_BOLD;
    }

    static subtitleRegular() {
        return UI_FONT_SUBTITLE_REGULAR;
    }

    static subtitleLight() {
        return UI_FONT_SUBTITLE_LIGHT;
    }

    static accentBold() {
        return UI_FONT_ACCENT_BOLD;
    }

    static accentRegular() {
        return UI_FONT_ACCENT_REGULAR;
    }

    static accentMedium() {
        return UI_FONT_ACCENT_MEDIUM;
    }

    static bodyBold() {
        return UI_FONT_BODY_BOLD;
    }

    static bodyRegular() {
        return UI_FONT_BODY_REGULAR;
    }

    static bodyMedium() {
        return UI_FONT_BODY_MEDIUM;
    }

    static smallBold() {
        return UI_FONT_SMALL_BOLD;
    }

    static smallRegular() {
        return UI_FONT_SMALL_REGULAR;
    }

    static smallMedium() {
        return UI_FONT_SMALL_MEDIUM;
    }

    static captionBold() {
        return UI_FONT_CAPTION_BOLD;
    }

    static captionRegular() {
        return UI_FONT_CAPTION_REGULAR;
    }

    static captionMedium() {
        return UI_FONT_CAPTION_MEDIUM;
    }

    static tinyBold() {
        return UI_FONT_TINY_BOLD;
    }

    static tinyRegular() {
        return UI_FONT_TINY_REGULAR;
    }

    static tinyMedium() {
        return UI_FONT_TINY_MEDIUM;
    }

    static menuBold() {
        return UI_FONT_MENU_BOLD;
    }

    static menuRegular() {
        return UI_FONT_MENU_REGULAR;
    }

    static iconBold() {
        return UI_FONT_ICON_BOLD;
    }

    static iconRegular() {
        return UI_FONT_ICON_REGULAR;
    }
}
