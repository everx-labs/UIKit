import { Platform } from 'react-native';

export const QR_CODE_LOGO_MARGIN_IN_SQUARES: number = 1;
export const QR_CODE_ITEM_BORDER_RADIUS: number = 2;
export const CIRCLE_QR_CODE_QUIET_ZONE_IN_SQUARES: number = 1;

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

    qrCode: {
        largeSize: 256,
        largeBorderWidth: 16,
        mediumSize: 168,
        mediumBorderWidth: 12,
        largeLogoSize: 40,
        mediumLogoSize: 27,
        maxValueLength: 4296,
    },

    carousel: {
        circleSize: 6,
        circleHitSlop: {
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
        },
    },

    timeInput: {
        warningIconSize: 20,
        amPmOffset: 12,
        amPmBorderRadius: 8,
    },

    calendar: {
        dayCeilPadding: 5,
        dayCeilPaddingBorderRadius: 20,
    },
};
