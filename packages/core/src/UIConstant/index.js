const UI_ANIMATION_SCALE_IN_FACTOR = 0.95;
const UI_ANIMATION_DURATION = 250;
const UI_FEEDBACK_DELAY = 100;

const UI_TINY_CONTENT_OFFSET = 4;
const UI_SMALL_CONTENT_OFFSET = 8;
const UI_NORMAL_CONTENT_OFFSET = 12;
const UI_DEFAULT_CONTENT_OFFSET = 16;
const UI_MEDIUM_CONTENT_OFFSET = 24;
const UI_HUGE_CONTENT_OFFSET = 32;
const UI_SPACIOUS_CONTENT_OFFSET = 40;
const UI_GREAT_CONTENT_OFFSET = 48;

const UI_SMALL_BORDER_RADIUS = 4;
const UI_NORMAL_BORDER_RADIUS = 6;
const UI_DEFAULT_BORDER_RADIUS = 8;
const UI_MEDIUM_BORDER_RADIUS = 12;

const UI_TINY_BUTTON_HEIGHT = 20;
const UI_SMALL_BUTTON_HEIGHT = 32;
const UI_MEDIUM_BUTTON_HEIGHT = 40;
const UI_DEFAULT_BUTTON_HEIGHT = 48;
const UI_LARGE_BUTTON_HEIGHT = 56;
const UI_EXTRA_LARGE_BUTTON_HEIGHT = 72;

const UI_TINY_CELL_HEIGHT = 16;
const UI_LITTLE_CELL_HEIGHT = 20;
const UI_SMALL_CELL_HEIGHT = 24;
const UI_NORMAL_CELL_HEIGHT = 32;
const UI_MEDIUM_CELL_HEIGHT = 40;
const UI_DEFAULT_CELL_HEIGHT = 48;
const UI_BIG_CELL_HEIGHT = 56;
const UI_LARGE_CELL_HEIGHT = 64;
const UI_GREAT_CELL_HEIGHT = 72;
const UI_HUGE_CELL_HEIGHT = 96;
const UI_GIANT_CELL_HEIGHT = 128;

const UI_SMALL_AVATAR_SIZE = 20;
const UI_MEDIUM_AVATAR_SIZE = 40;
const UI_DETAILS_AVATAR_SIZE = 48;

const UI_DEFAULT_ICON_SIZE = 24;
const UI_MEDIUM_ICON_SIZE = 32;
const UI_LARGE_ICON_SIZE = 128;

const UI_ELASTIC_WIDTH_NORMAL = 768;
const UI_ELASTIC_WIDTH_MAX = 1280;

const UI_MASTER_SCREEN_WIDTH = 375;

const UI_FLOATING_LABEL_HEIGHT = 40;

const UI_INFINITE_SCROLL_TRESHOLD = 0.25; // quarter of the visible page (before was: 64);

const UI_PROFILE_PHOTO_SIZE = 72;

const MAX_DECIMAL_DIGITS = 9;

const INITIAL_RENDER_DATA_COUNT = 12; // good for displaying a tables of 1,2,3,4 columns

const DASH_SYMBOL = '\u2014';

const UI_HIT_SLOP_NAVIGATION = { top: 10, left: 20, bottom: 10, right: 20 };

export default class UIConstant {
    // Animations
    static animationScaleInFactor() {
        return UI_ANIMATION_SCALE_IN_FACTOR;
    }

    static animationDuration() {
        return UI_ANIMATION_DURATION;
    }

    static feedbackDelay() {
        return UI_FEEDBACK_DELAY;
    }

    // Content offsets
    static tinyContentOffset() {
        // 4
        return UI_TINY_CONTENT_OFFSET;
    }

    static smallContentOffset() {
        // 8
        return UI_SMALL_CONTENT_OFFSET;
    }

    static normalContentOffset() {
        // 12
        return UI_NORMAL_CONTENT_OFFSET;
    }

    static contentOffset() {
        return UI_DEFAULT_CONTENT_OFFSET;
    }

    static mediumContentOffset() {
        return UI_MEDIUM_CONTENT_OFFSET;
    }

    static hugeContentOffset() {
        return UI_HUGE_CONTENT_OFFSET;
    }

    static spaciousContentOffset() {
        return UI_SPACIOUS_CONTENT_OFFSET;
    }

    static greatContentOffset() {
        return UI_GREAT_CONTENT_OFFSET;
    }

    // Border radiuses

    static smallBorderRadius() {
        return UI_SMALL_BORDER_RADIUS;
    }

    static normalBorderRadius() {
        return UI_NORMAL_BORDER_RADIUS;
    }

    static borderRadius() {
        return UI_DEFAULT_BORDER_RADIUS;
    }

    static mediumBorderRadius() {
        return UI_MEDIUM_BORDER_RADIUS;
    }

    // Button heights

    static tinyButtonHeight() {
        return UI_TINY_BUTTON_HEIGHT;
    }

    static smallButtonHeight() {
        return UI_SMALL_BUTTON_HEIGHT; // 32
    }

    static mediumButtonHeight() {
        // 40
        return UI_MEDIUM_BUTTON_HEIGHT;
    }

    static buttonHeight() {
        return UI_DEFAULT_BUTTON_HEIGHT; // 48
    }

    static largeButtonHeight() {
        // 56
        return UI_LARGE_BUTTON_HEIGHT;
    }

    static extraLargeButtonHeight() {
        // 72
        return UI_EXTRA_LARGE_BUTTON_HEIGHT;
    }

    static tinyCellHeight() {
        return UI_TINY_CELL_HEIGHT;
    }

    static littleCellHeight() {
        return UI_LITTLE_CELL_HEIGHT;
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

    static hugeCellHeight() {
        return UI_HUGE_CELL_HEIGHT;
    }

    static giantCellHeight() {
        return UI_GIANT_CELL_HEIGHT;
    }

    static mediumAvatarSize() {
        return UI_MEDIUM_AVATAR_SIZE;
    }

    static detailsAvatarSize() {
        return UI_DETAILS_AVATAR_SIZE;
    }

    static smallAvatarSize() {
        return UI_SMALL_AVATAR_SIZE;
    }

    // Icons

    static iconSize() {
        return UI_DEFAULT_ICON_SIZE;
    }

    static mediumIconSize() {
        return UI_MEDIUM_ICON_SIZE;
    }

    static largeIconSize() {
        return UI_LARGE_ICON_SIZE;
    }

    // Elastic width

    static elasticWidthNormal() {
        return UI_ELASTIC_WIDTH_NORMAL;
    }

    static elasticWidthMax() {
        return UI_ELASTIC_WIDTH_MAX;
    }

    static masterScreenWidth() {
        return UI_MASTER_SCREEN_WIDTH;
    }

    // Components size

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

    static initialRenderDataCount() {
        return INITIAL_RENDER_DATA_COUNT;
    }

    static maxDecimalDigits() {
        return MAX_DECIMAL_DIGITS;
    }

    static dashSymbol() {
        return DASH_SYMBOL;
    }

    static navigationHitSlop() {
        return UI_HIT_SLOP_NAVIGATION;
    }
}
