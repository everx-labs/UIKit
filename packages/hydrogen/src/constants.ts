import { Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';

export const UIConstant = {
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

    elasticWidthCardSheet: 414,
    elasticWidthBottomSheet: 448,

    swipeThreshold: 50,

    animationConfig: {
        duration: 100,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
    },

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
};
