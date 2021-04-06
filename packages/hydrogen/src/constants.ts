import { Platform } from 'react-native';

export const UIConstant = {
    iconSize: 24,

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
    normalContentOffset: 12,
    contentOffset: 16,
    borderRadius: 8,
    alertBorderRadius: 12,

    elasticWidthCardSheet: 414,
    elasticWidthBottomSheet: 448,

    swipeThreshold: 50,

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
};
