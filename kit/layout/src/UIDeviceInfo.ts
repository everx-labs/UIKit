import { Platform } from 'react-native';
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
};
