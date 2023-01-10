import { Platform } from 'react-native';

const GRID_LINE_HEIGHT = 4;

export const UILayoutConstant = {
    iconSize: 24 /** 24 */,

    buttonBorderWidth: 1 /** 1 */,

    /** ButtonHeight */
    tinyButtonHeight: 20 /** 20 */,
    smallButtonHeight: 32 /** 32 */,
    mediumButtonHeight: 40 /** 40 */,
    buttonHeight: 48 /** 48 */,
    largeButtonHeight: 56 /** 56 */,
    extraLargeButtonHeight: 72 /** 72 */,

    /** CellHeight */
    tinyCellHeight: 16 /** 16 */,
    littleCellHeight: 20 /** 20 */,
    smallCellHeight: 24 /** 24 */,
    normalCellHeight: 32 /** 32 */,
    mediumCellHeight: 40 /** 40 */,
    defaultCellHeight: 48 /** 48 */,
    bigCellHeight: 56 /** 56 */,
    largeCellHeight: 64 /** 64 */,
    greatCellHeight: 72 /** 72 */,
    hugeCellHeight: 96 /** 96 */,
    giantCellHeight: 128 /** 128 */,

    minimumWidthToShowFoldingNotice: 400 /** 400 */,
    minNoticeSize: 88 /** 88 */,
    minNoticeIconSize: 64 /** 64 */,
    maxNoticeIconSize: 88 /** 88 */,

    /** Horizontal offset */
    tinyContentOffset: 4 /** 4 */,
    smallContentOffset: 8 /** 8 */,
    normalContentOffset: 12 /** 12 */,
    contentOffset: 16 /** 16 */,
    /** Vertical offset */
    contentInsetVerticalX1: GRID_LINE_HEIGHT /** GRID_LINE_HEIGHT */,
    contentInsetVerticalX2: 2 * GRID_LINE_HEIGHT /** 2 * GRID_LINE_HEIGHT */,
    contentInsetVerticalX3: 3 * GRID_LINE_HEIGHT /** 3 * GRID_LINE_HEIGHT */,
    contentInsetVerticalX4: 4 * GRID_LINE_HEIGHT /** 4 * GRID_LINE_HEIGHT */,

    smallBorderRadius: 4 /** 4 */,
    borderRadius: 8 /** 8 */,
    mediumBorderRadius: 12 /** 12 */,
    alertBorderRadius: 16 /** 16 */,
    pillButtonBorderRadius: 20 /** 20 */,

    elasticWidthCardSheet: 414 /** 414 */,
    elasticWidthBottomSheet: 448 /** 448 */,
    swipeThreshold: 50 /** 50 */,
    rubberBandEffectDistance: 50 /** 50 */,

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

    headerHeight: 56 /** 56 */,

    input: {
        borderRadius: 12 /** 12 */,
    },

    elasticWidthNormal: 768 /** 768 */,
    elasticWidthMax: 1280 /** 1280 */,
};
