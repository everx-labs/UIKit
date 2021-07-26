import { Platform } from 'react-native';

export const QR_CODE_SIZE: number = 256;
export const QR_CODE_LOGO_SIZE: number = 40;
export const QR_CODE_LOGO_MARGIN_IN_SQUARES: number = 1;
export const QR_CODE_ITEM_BORDER_RADIUS: number = 2;
export const CIRCLE_QR_CODE_BORDER_WIDTH: number = 16;
export const CIRCLE_QR_CODE_QUIET_ZONE_IN_SQUARES: number = 1;
export const SQUARE_QR_CODE_BORDER_WIDTH: number = 16;

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
