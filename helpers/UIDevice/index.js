import { Platform } from 'react-native';
import SafeArea from 'react-native-safe-area';
import MobileDetect from 'mobile-detect';
import DeviceInfo from 'react-native-device-info';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const UI_STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
const UI_NAVIGATION_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const UI_IS_DESKTOP_WEB = Platform.OS === 'web'
        && !(new MobileDetect(window.navigator.userAgent)).mobile();

const UI_IS_MOBILE_WEB = Platform.OS === 'web'
    && (new MobileDetect(window.navigator.userAgent)).phone();

const UI_IS_TABLET_WEB = Platform.OS === 'web'
        && (new MobileDetect(window.navigator.userAgent)).tablet();

const UI_IS_TABLET = DeviceInfo.isTablet() || UI_IS_TABLET_WEB;

const UI_IS_MOBILE = (Platform.OS !== 'web' && !DeviceInfo.isTablet()) || UI_IS_MOBILE_WEB;

export default class UIDevice {
    static statusBarHeight() {
        return UI_STATUS_BAR_HEIGHT;
    }

    static navigationBarHeight() {
        return UI_NAVIGATION_BAR_HEIGHT;
    }

    static safeAreaInsets() {
        return SafeArea.getSafeAreaInsetsForRootView().then((result) => {
            return Promise.resolve(result.safeAreaInsets);
        }).catch(() => {
            return Promise.resolve({
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            });
        });
    }

    static isDesktopWeb() {
        return UI_IS_DESKTOP_WEB;
    }

    static isMobileWeb() {
        return UI_IS_MOBILE_WEB;
    }

    static isTabletWeb() {
        return UI_IS_TABLET_WEB;
    }

    static isDesktop() {
        return UI_IS_DESKTOP_WEB; // TODO:
    }

    static isTablet() {
        return UI_IS_TABLET;
    }

    static isMobile() {
        return UI_IS_MOBILE;
    }
}
