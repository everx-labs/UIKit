import { Platform } from 'react-native';

export const UIConstant = {
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
    alertBorderRadius: 12,

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
};
