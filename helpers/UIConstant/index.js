import { Platform } from 'react-native';

import UIColor from '../UIColor';

const UI_ANIMATION_DURATION = 250;
const UI_SWIPE_THRESHOLD = 100;
const UI_SMALL_SWIPE_THRESHOLD = 30;
const UI_COVER_BOUNCE_OFFSET = 20;

const UI_TINY_BORDER_RADIUS = 2;
const UI_SMALL_BORDER_RADIUS = 4;
const UI_DEFAULT_BORDER_RADIUS = 8;
const UI_MEDIUM_BORDER_RADIUS = 16;

const UI_TINY_CONTENT_OFFSET = 4;
const UI_SMALL_CONTENT_OFFSET = 8;
const UI_NORMAL_CONTENT_OFFSET = 12;
const UI_DEFAULT_CONTENT_OFFSET = 16;
const UI_MEDIUM_CONTENT_OFFSET = 24;
const UI_LARGE_CONTENT_OFFSET = 28;
const UI_HUGE_CONTENT_OFFSET = 32;
const UI_GREAT_CONTENT_OFFSET = 48;
const UI_MAJOR_CONTENT_OFFSET = 64;
const UI_VAST_CONTENT_OFFSET = 80;
const UI_ENORMOUS_CONTENT_OFFSET = 104;
const UI_GIANT_CONTENT_OFFSET = 136;

const UI_HORIZONTAL_CONTENT_OFFSET = 12;
const UI_VERTICAL_CONTENT_OFFSET = 6;

const UI_TINY_ICON_SIZE = 4;

const UI_TINY_BUTTON_HEIGHT = 20;
const UI_SMALL_BUTTON_HEIGHT = 32;
const UI_MEDIUM_BUTTON_HEIGHT = 40;
const UI_DEFAULT_BUTTON_HEIGHT = 48;
const UI_LARGE_BUTTON_HEIGHT = 56;

const UI_SMALL_CELL_HEIGHT = 24;
const UI_NORMAL_CELL_HEIGHT = 32;
const UI_MEDIUM_CELL_HEIGHT = 40;
const UI_DEFAULT_CELL_HEIGHT = 48;
const UI_BIG_CELL_HEIGHT = 56;
const UI_LARGE_CELL_HEIGHT = 64;
const UI_GREAT_CELL_HEIGHT = 72;
const UI_MAJOR_CELL_HEIGHT = 80;
const UI_HUGE_CELL_HEIGHT = 96;
const UI_GIANT_CELL_HEIGHT = 128;

const UI_DATA_CAPTION_HEIGHT = 104;
const UI_NAVIGATION_BAR_HEIGHT = 80;

const UI_SMALL_AVATAR_SIZE = 20;
const UI_MEDIUM_AVATAR_SIZE = 40;
const UI_LARGE_AVATAR_SIZE = 64;

const UI_ICON_SIZE = 24;

const UI_DISABLED_OUTLINE = Platform.OS === 'web' ? { outline: '0' } : null;

const UI_SEPARATOR_SYMBOL = '~';

const UI_INITIAL_STYLE_FOR_ALL = Platform.OS === 'web' ? { all: 'initial' } : null;

const UI_ELASTIC_WIDTH_NARROW = 80;
const UI_ELASTIC_WIDTH_REGULAR = 304;
const UI_ELASTIC_WIDTH_HALF_NORMAL = 376;
const UI_ELASTIC_WIDTH_MEDIUM = 592;
const UI_ELASTIC_WIDTH_NORMAL = 768;
const UI_ELASTIC_WIDTH_WIDE = 880;
const UI_ELASTIC_WIDTH_BROAD = 1000;
const UI_ELASTIC_WIDTH_MAX = 1280;
const UI_ELASTIC_WIDTH_HUGE = 1600;

const UI_MAX_SCREEN_HEIGHT = 1280;

const BACKGROUND_IMAGE_CONTAINER_WIDTH = 380;
const BACKGROUND_IMAGE_CONTAINER_HEIGHT = 594;

const UI_TAB_WIDTH = 96;
const UI_PASSWORD_PROMPT_WIDTH = 416;
const UI_NOTICE_WIDTH = 360;
const UI_TOAST_WIDTH = 328;

const UI_ACTIONSHEET_ITEM_HEIGHT = 48;
const UI_MENU_WIDTH = 176; // menu for web

const UI_TOOLTIP_MAX_WIDTH = 288;
const UI_TOOLTIP_MAX_HEIGHT = 96;

const UI_TEXT_INPUT_HEIGHT = 48;
const UI_FLOATING_LABEL_HEIGHT = 40;

const UI_INFINITE_SCROLL_TRESHOLD = 0.25; // quarter of the visible page (before was: 64);

const UI_PROFILE_PHOTO_SIZE = 72;

const MAX_DECIMAL_DIGITS = 8;
const MAX_NUMBER_DIGITS = 9;
const SHORT_DATE_LENGTH = 10;

const MAX_TEXT_LINE_LENGTH = 200;

const INITIAL_RENDER_DATA_COUNT = 12; // good for displaying a tables of 1,2,3,4 columns

const UI_COMMON_SHADOW = Platform.OS === 'android'
    ? {
        elevation: 1,
    }
    : {
        shadowColor: UIColor.overlayWithAlpha(0.04),
        shadowOpacity: 1,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    };

const UI_SHADOW_40 = Platform.OS === 'android'
    ? {
        elevation: 1,
    }
    : {
        shadowColor: UIColor.dark(),
        shadowOpacity: 0.12,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 12,
        },
    };

const UI_CARD_SHADOW = Platform.OS === 'android'
    ? {
        elevation: 8,
    }
    : {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    };

const UI_CARD_SHADOW_WIDTH = 40;

export default class UIConstant {
    // Animations
    static animationDuration() {
        return UI_ANIMATION_DURATION;
    }

    static smallSwipeThreshold() {
        return UI_SMALL_SWIPE_THRESHOLD;
    }

    static swipeThreshold() {
        return UI_SWIPE_THRESHOLD;
    }

    static coverBounceOffset() {
        return UI_COVER_BOUNCE_OFFSET;
    }

    // Content offsets
    static tinyContentOffset() {
        return UI_TINY_CONTENT_OFFSET;
    }

    static smallContentOffset() {
        return UI_SMALL_CONTENT_OFFSET;
    }

    static normalContentOffset() {
        return UI_NORMAL_CONTENT_OFFSET;
    }

    static contentOffset() {
        return UI_DEFAULT_CONTENT_OFFSET;
    }

    static mediumContentOffset() {
        return UI_MEDIUM_CONTENT_OFFSET;
    }

    static largeContentOffset() {
        return UI_LARGE_CONTENT_OFFSET;
    }

    static hugeContentOffset() {
        return UI_HUGE_CONTENT_OFFSET;
    }

    static greatContentOffset() {
        return UI_GREAT_CONTENT_OFFSET;
    }

    static majorContentOffset() {
        return UI_MAJOR_CONTENT_OFFSET;
    }

    static vastContentOffset() {
        return UI_VAST_CONTENT_OFFSET;
    }

    static enormousContentOffset() {
        return UI_ENORMOUS_CONTENT_OFFSET;
    }

    static giantContentOffset() {
        return UI_GIANT_CONTENT_OFFSET;
    }

    static horizontalContentOffset() {
        return UI_HORIZONTAL_CONTENT_OFFSET;
    }

    static verticalContentOffset() {
        return UI_VERTICAL_CONTENT_OFFSET;
    }

    // border radiuses
    static tinyBorderRadius() {
        return UI_TINY_BORDER_RADIUS;
    }

    static smallBorderRadius() {
        return UI_SMALL_BORDER_RADIUS;
    }

    static borderRadius() {
        return UI_DEFAULT_BORDER_RADIUS;
    }

    static mediumBorderRadius() {
        return UI_MEDIUM_BORDER_RADIUS;
    }

    // Button heights
    static tinyIconSize() {
        return UI_TINY_ICON_SIZE;
    }

    static tinyButtonHeight() {
        return UI_TINY_BUTTON_HEIGHT;
    }

    static smallButtonHeight() {
        return UI_SMALL_BUTTON_HEIGHT;
    }

    static mediumButtonHeight() {
        return UI_MEDIUM_BUTTON_HEIGHT;
    }

    static buttonHeight() {
        return UI_DEFAULT_BUTTON_HEIGHT;
    }

    static largeButtonHeight() {
        return UI_LARGE_BUTTON_HEIGHT;
    }

    static smallCellHeight() {
        return UI_SMALL_CELL_HEIGHT;
    }

    static normalCellHeight() {
        return UI_NORMAL_CELL_HEIGHT;
    }

    static defaultCellHeight() {
        return UI_DEFAULT_CELL_HEIGHT;
    }

    static mediumCellHeight() {
        return UI_MEDIUM_CELL_HEIGHT;
    }

    static bigCellHeight() {
        return UI_BIG_CELL_HEIGHT;
    }

    static largeCellHeight() {
        return UI_LARGE_CELL_HEIGHT;
    }

    static greatCellHeight() {
        return UI_GREAT_CELL_HEIGHT;
    }

    static majorCellHeight() {
        return UI_MAJOR_CELL_HEIGHT;
    }

    static hugeCellHeight() {
        return UI_HUGE_CELL_HEIGHT;
    }

    static giantCellHeight() {
        return UI_GIANT_CELL_HEIGHT;
    }

    static dataCaptionHeight() {
        return UI_DATA_CAPTION_HEIGHT;
    }

    static navBarHeight() {
        return UI_NAVIGATION_BAR_HEIGHT;
    }

    static largeAvatarSize() {
        return UI_LARGE_AVATAR_SIZE;
    }

    static mediumAvatarSize() {
        return UI_MEDIUM_AVATAR_SIZE;
    }

    static smallAvatarSize() {
        return UI_SMALL_AVATAR_SIZE;
    }

    static iconSize() {
        return UI_ICON_SIZE;
    }

    // Styles
    static disabledOutline() {
        return UI_DISABLED_OUTLINE;
    }

    static initialStyleForAll() {
        return UI_INITIAL_STYLE_FOR_ALL;
    }

    // Elastic width
    static elasticWidthNarrow() {
        return UI_ELASTIC_WIDTH_NARROW;
    }

    static elasticWidthRegular() {
        return UI_ELASTIC_WIDTH_REGULAR;
    }

    static elasticWidthMedium() {
        return UI_ELASTIC_WIDTH_MEDIUM;
    }

    static elasticWidthHalfNormal() {
        return UI_ELASTIC_WIDTH_HALF_NORMAL;
    }

    static elasticWidthNormal() {
        return UI_ELASTIC_WIDTH_NORMAL;
    }

    static elasticWidthWide() {
        return UI_ELASTIC_WIDTH_WIDE;
    }

    static elasticWidthBroad() {
        return UI_ELASTIC_WIDTH_BROAD;
    }

    static elasticWidthMax() {
        return UI_ELASTIC_WIDTH_MAX;
    }

    static elasticWidthHuge() {
        return UI_ELASTIC_WIDTH_HUGE;
    }

    static maxScreenHeight() {
        return UI_MAX_SCREEN_HEIGHT;
    }

    static backgroundImageContainerWidth() {
        return BACKGROUND_IMAGE_CONTAINER_WIDTH;
    }

    static backgroundImageContainerHeight() {
        return BACKGROUND_IMAGE_CONTAINER_HEIGHT;
    }

    static tabWidth() {
        return UI_TAB_WIDTH;
    }

    static passwordPromptWidth() {
        return UI_PASSWORD_PROMPT_WIDTH;
    }

    static noticeWidth() {
        return UI_NOTICE_WIDTH;
    }

    static toastWidth() {
        return UI_TOAST_WIDTH;
    }

    // Action sheet
    static actionSheetItemHeight() {
        return UI_ACTIONSHEET_ITEM_HEIGHT;
    }

    // Menu for web
    static menuWidth() {
        return UI_MENU_WIDTH;
    }

    static tooltipMaxWidth() {
        return UI_TOOLTIP_MAX_WIDTH;
    }

    static tooltipMaxHeight() {
        return UI_TOOLTIP_MAX_HEIGHT;
    }

    // Symbols
    static separatorSymbol() {
        return UI_SEPARATOR_SYMBOL;
    }

    // Shadows
    static commonShadow() {
        return UI_COMMON_SHADOW;
    }

    static shadow40() {
        return UI_SHADOW_40;
    }

    static cardShadow() {
        return UI_CARD_SHADOW;
    }

    static cardShadowWidth() {
        return UI_CARD_SHADOW_WIDTH;
    }

    // Components size
    static textInputHeight() {
        return UI_TEXT_INPUT_HEIGHT;
    }

    static floatingLabelHeight() {
        return UI_FLOATING_LABEL_HEIGHT;
    }

    // Infinite scroll
    static infiniteScrollTreshold() {
        return UI_INFINITE_SCROLL_TRESHOLD;
    }

    static profilePhotoSize() {
        return UI_PROFILE_PHOTO_SIZE;
    }

    static maxTextLineLength() {
        return MAX_TEXT_LINE_LENGTH;
    }

    static initialRenderDataCount() {
        return INITIAL_RENDER_DATA_COUNT;
    }

    static maxNumberDigits() {
        return MAX_NUMBER_DIGITS;
    }

    static maxDecimalDigits() {
        return MAX_DECIMAL_DIGITS;
    }

    static shortDateLength() {
        return SHORT_DATE_LENGTH;
    }
}
