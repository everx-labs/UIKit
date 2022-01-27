import { Platform } from 'react-native';

export const UIConstant = {
    notice: {
        countdownCircle: {
            size: 20,
            strokeWidth: 1.2,
        },
    },
    alertBorderRadius: 12,
    alertWindowMinimumHorizontalOffset: 48,
    alertWindowMaximumWidth: 350,
    maxSlideDistanceOfTap: 4,
    maxWidth: 382,
    toastIndentFromScreenEdges: Platform.OS === 'web' ? 32 : 16,
    notificationDurationsShort: Platform.OS === 'web' ? 1.5 * 1500 : 1500,
    notificationDurationsLong: Platform.OS === 'web' ? 1.5 * 3000 : 3000,
    defaultNoticeHeight: 72, // Using when notice has not yet been measured
    longPressDelay: 200,
    iconPushSize: 40,
    menuWidth: 256,
};
