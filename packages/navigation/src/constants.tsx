import { Platform } from 'react-native';

const GRID_LINE_HEIGHT = 4;

export const UIConstant = {
    iconSearchSize: 20,
    iconSearchingIndicatorSize: 14,

    iconPushSize: 40,

    scrollContentInsetHorizontal: 16,
    contentInsetVerticalX2: 2 * GRID_LINE_HEIGHT,
    contentInsetVerticalX3: 3 * GRID_LINE_HEIGHT,
    contentInsetVerticalX4: 4 * GRID_LINE_HEIGHT,

    contentOffset: 4 * GRID_LINE_HEIGHT,
    alertBorderRadius: 12,

    headerHeight: 56,

    elastiicWidthController: 600,

    elasticWidthCardSheet: 414,
    elasticWidthBottomSheet: 448,
    swipeThreshold: 50,
    rubberBandEffectDistance: 50,

    titleMinimumFontScale: 0.7,

    alertWindowMinimumHorizontalOffset: 48,
    alertWindowMaximumWidth: 350,

    maxSlideDistanceOfTap: 4,

    refreshControlHeight: 50,
    refreshControlLoaderSize: 20,
    refreshControlPositioningDuration: 200,
    notice: {
        maxWidth: 382,
        toastIndentFromScreenEdges: Platform.OS === 'web' ? 32 : 16,
        notificationDurationsShort: Platform.OS === 'web' ? 1.5 * 1500 : 1500,
        notificationDurationsLong: Platform.OS === 'web' ? 1.5 * 3000 : 3000,
        defaultNoticeHeight: 72, // Using when notice has not yet been measured
        longPressDelay: 200,
    },
    pager: {
        tabBarOffset: 16,
        pagerViewHeight: 72,
    },
};
