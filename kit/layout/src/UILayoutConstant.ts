import { Platform } from 'react-native';

export const UILayoutConstant = {
    iconSize: 24,

    loaderSize: 18,

    buttonBorderWidth: 1,

    boxButtonHeight: 48,
    msgButtonHeight: 40,
    pillButtonHeight: 32,
    linkButtonHeight: 48,

    smallCellHeight: 24,
    defaultCellHeight: 48,

    minimumWidthToShowFoldingNotice: 400,
    minNoticeSize: 88,
    minNoticeIconSize: 64,
    maxNoticeIconSize: 88,

    tinyContentOffset: 4,
    smallContentOffset: 8,
    normalContentOffset: 12,
    contentOffset: 16,
    borderRadius: 8,
    alertBorderRadius: 12,
    pillButtonBorderRadius: 20,

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

    switcher: {
        circlePadding: 2,
        squarePadding: 3,
        squareBorderRadius: 4,
        thikIconSize: 12,
        radioDotSize: 8,
        offBorderWidth: 1.75,
        toggleDotSize: 10,
        toggleWidth: 32,
        toggleHeight: 18,
        togglePadding: 4,
    },
};
