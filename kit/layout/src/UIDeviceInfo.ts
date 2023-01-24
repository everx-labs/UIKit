import { PixelRatio, Platform } from 'react-native';
import MobileDetect from 'mobile-detect';
import DeviceInfo from 'react-native-device-info';

/**
 * Is this a desktop browser?
 */
export const isDesktopWeb =
    Platform.OS === 'web' && !new MobileDetect(window.navigator.userAgent).mobile();

/**
 * Is this a mobile browser?
 */
export const isMobileWeb =
    Platform.OS === 'web' && !!new MobileDetect(window.navigator.userAgent).phone();

/**
 * Is this a tablet browser?
 */
const isTabletWeb =
    Platform.OS === 'web' && !!new MobileDetect(window.navigator.userAgent).tablet();

/**
 * Is this a tablet device?
 */
export const isTablet = Platform.OS !== 'web' ? DeviceInfo.isTablet() : isTabletWeb;

/**
 * Is this a mobile device?
 */
export const isMobile = Platform.OS !== 'web' ? !DeviceInfo.isTablet() : isMobileWeb;

const UI_IS_MOBILE_WEB_IOS =
    Platform.OS === 'web' &&
    (new MobileDetect(window.navigator.userAgent).os() === 'iOS' ||
        new MobileDetect(window.navigator.userAgent).os() === 'iPadOS');

const UI_IS_MOBILE_WEB_ANDROID =
    Platform.OS === 'web' && new MobileDetect(window.navigator.userAgent).os() === 'AndroidOS';

/**
 * OS of the device
 */
export function deviceOS(): string {
    if (Platform.OS === 'web') {
        if (UI_IS_MOBILE_WEB_IOS) {
            return 'ios';
        }
        if (UI_IS_MOBILE_WEB_ANDROID) {
            return 'android';
        }
        return 'web';
    }
    return Platform.OS;
}

/**
 * Version of the device OS
 */
const systemVersion = Platform.OS !== 'web' ? DeviceInfo.getSystemVersion() : 'Web'; // TODO
/**
 * Device model
 */
const deviceModel = Platform.OS !== 'web' ? DeviceInfo.getModel() : 'Browser'; // TODO
/**
 * Is this a emulator?
 */
const isEmulator = DeviceInfo.isEmulator();
/**
 * Name of the application
 */
const appName = Platform.OS !== 'web' ? DeviceInfo.getApplicationName() : '';
/**
 * Version of the application
 */
const appVersion = Platform.OS !== 'web' ? DeviceInfo.getReadableVersion() : '';

/**
 * Image scale ratio
 */
function imageScale(): string {
    const ratio = PixelRatio.get();

    let scale = '@3x';
    if (ratio < 2) {
        scale = '';
    } else if (ratio < 3) {
        scale = '@2x';
    }

    return scale;
}

export const UIDeviceInfo = {
    /**
     * Is this a desktop browser?
     */
    isDesktopWeb,
    /**
     * Is this a mobile browser?
     */
    isMobileWeb,
    /**
     * Is this a tablet device?
     */
    isTablet,
    /**
     * Is this a mobile device?
     */
    isMobile,
    /**
     * Is this a emulator?
     */
    isEmulator,
    /**
     * Name of the application
     */
    appName,
    /**
     * Version of the application
     */
    appVersion,
    /**
     * OS of the device
     */
    deviceOS: deviceOS(),
    /**
     * Version of the device OS
     */
    systemVersion,
    /**
     * Device model
     */
    deviceModel,
    /**
     * Image scale ratio
     */
    imageScale: imageScale(),
};
