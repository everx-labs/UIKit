import { Platform } from 'react-native';

export const UIConstant = {
    maxWidth: 382,
    toastIndentFromScreenEdges: Platform.OS === 'web' ? 32 : 16,
    notificationDurationsShort: Platform.OS === 'web' ? 1.5 * 1500 : 1500,
    notificationDurationsLong: Platform.OS === 'web' ? 1.5 * 3000 : 3000,
    defaultNoticeHeight: 72, // Using when notice has not yet been measured
    longPressDelay: 200,
};
