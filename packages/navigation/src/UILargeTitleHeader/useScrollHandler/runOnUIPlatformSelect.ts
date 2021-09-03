import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const isWeb = Platform.OS === 'android';

export function runOnUIPlatformSelect<T>(obj: { ios?: T; android?: T; web?: T; default: T }) {
    'worklet';

    if (obj.ios != null && isIOS) {
        return obj.ios;
    }
    if (obj.android != null && isAndroid) {
        return obj.android;
    }
    if (obj.web != null && isWeb) {
        return obj.web;
    }
    return obj.default;
}
