import { Platform } from 'react-native';

const GRID_LINE_HEIGHT = 4;

export const UILayoutConstant = {
    /** 24 */
    iconSize: 24,
    /** 32 */
    mediumIconSize: 32,
    /** 128 */
    largeIconSize: 128,

    /** 1 */
    buttonBorderWidth: 1,

    /** ButtonHeight */
    /** 20 */
    tinyButtonHeight: 20,
    /** 32 */
    smallButtonHeight: 32,
    /** 40 */
    mediumButtonHeight: 40,
    /** 48 */
    buttonHeight: 48,
    /** 56 */
    largeButtonHeight: 56,
    /** 72 */
    extraLargeButtonHeight: 72,

    /** CellHeight */
    /** 16 */
    tinyCellHeight: 16,
    /** 20 */
    littleCellHeight: 20,
    /** 24 */
    smallCellHeight: 24,
    /** 32 */
    normalCellHeight: 32,
    /** 40 */
    mediumCellHeight: 40,
    /** 48 */
    defaultCellHeight: 48,
    /** 56 */
    bigCellHeight: 56,
    /** 64 */
    largeCellHeight: 64,
    /** 72 */
    greatCellHeight: 72,
    /** 96 */
    hugeCellHeight: 96,
    /** 128 */
    giantCellHeight: 128,

    /** 400 */
    minimumWidthToShowFoldingNotice: 400,
    /** 88 */
    minNoticeSize: 88,
    /** 64 */
    minNoticeIconSize: 64,
    /** 88 */
    maxNoticeIconSize: 88,

    /** Horizontal offset */
    /** 4 */
    tinyContentOffset: 4,
    /** 8 */
    smallContentOffset: 8,
    /** 12 */
    normalContentOffset: 12,
    /** 16 */
    contentOffset: 16,
    /** 24 */
    mediumContentOffset: 24,
    /** 32 */
    hugeContentOffset: 32,
    /** 40 */
    spaciousContentOffset: 40,
    /** 48 */
    greatContentOffset: 48,
    /** 56 */
    bigContentOffset: 56,
    /** Vertical offset */
    /** 4 */
    contentInsetVerticalX1: GRID_LINE_HEIGHT,
    /** 8 */
    contentInsetVerticalX2: 2 * GRID_LINE_HEIGHT,
    /** 12 */
    contentInsetVerticalX3: 3 * GRID_LINE_HEIGHT,
    /** 16 */
    contentInsetVerticalX4: 4 * GRID_LINE_HEIGHT,
    /** 24 */
    contentInsetVerticalX6: 6 * GRID_LINE_HEIGHT,
    /** 32 */
    contentInsetVerticalX8: 8 * GRID_LINE_HEIGHT,
    /** 40 */
    contentInsetVerticalX10: 10 * GRID_LINE_HEIGHT,
    /** 48 */
    contentInsetVerticalX12: 12 * GRID_LINE_HEIGHT,
    /** 56 */
    contentInsetVerticalX14: 14 * GRID_LINE_HEIGHT,

    /** 4 */
    smallBorderRadius: 4,
    /** 6 */
    normalBorderRadius: 6,
    /** 8 */
    borderRadius: 8,
    /** 12 */
    mediumBorderRadius: 12,
    /** 16 */
    alertBorderRadius: 16,
    /** 20 */
    pillButtonBorderRadius: 20,

    /** 768 */
    elasticWidthNormal: 768,
    /** 1280 */
    elasticWidthMax: 1280,
    /** 414 */
    elasticWidthCardSheet: 414,
    /** 448 */
    elasticWidthBottomSheet: 448,
    /** 50 */
    swipeThreshold: 50,
    /** 50 */
    rubberBandEffectDistance: 50,

    cardShadow:
        Platform.OS === 'android'
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
              },

    dashSymbol: '\u2014',

    hitSlop: {
        top: 24,
        bottom: 24,
        left: 24,
        right: 24,
    },

    /** 56 */
    headerHeight: 56,

    input: {
        /** 12 */
        borderRadius: 12,
    },

    // Animations
    /** 250 */
    animationDuration: 250,
    /** 100 */
    feedbackDelay: 100,

    // Infinite scroll
    /** 12 */
    initialRenderDataCount: 12, // good for displaying a tables of 1,2,3,4 columns
    /** 0.25 */
    infiniteScrollTreshold: 0.25, // quarter of the visible page (before was: 64);
};
