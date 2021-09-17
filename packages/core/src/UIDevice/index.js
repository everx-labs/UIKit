// @flow
import { Platform, PixelRatio } from 'react-native';
import MobileDetect from 'mobile-detect';
import DeviceInfo from 'react-native-device-info';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const UI_STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
const UI_NAVIGATION_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const UI_IS_DESKTOP_WEB =
    Platform.OS === 'web' && !new MobileDetect(window.navigator.userAgent).mobile();

const UI_IS_MOBILE_WEB =
    Platform.OS === 'web' && new MobileDetect(window.navigator.userAgent).phone();

const UI_IS_MOBILE_WEB_IOS =
    Platform.OS === 'web' &&
    (new MobileDetect(window.navigator.userAgent).os() === 'iOS' ||
        new MobileDetect(window.navigator.userAgent).os() === 'iPadOS');

const UI_IS_MOBILE_WEB_ANDROID =
    Platform.OS === 'web' && new MobileDetect(window.navigator.userAgent).os() === 'AndroidOS';

const UI_IS_TABLET_WEB =
    Platform.OS === 'web' && new MobileDetect(window.navigator.userAgent).tablet();

const UI_IS_TABLET = Platform.OS !== 'web' ? DeviceInfo.isTablet() : UI_IS_TABLET_WEB;

const UI_IS_MOBILE = Platform.OS !== 'web' ? !DeviceInfo.isTablet() : UI_IS_MOBILE_WEB;

const UI_IS_WEBKIT =
    Platform.OS !== 'web'
        ? Number.NaN
        : new MobileDetect(window.navigator.userAgent).version('Webkit');

const APP_NAME = Platform.OS !== 'web' ? DeviceInfo.getApplicationName() : '';

const APP_VERSION = Platform.OS !== 'web' ? DeviceInfo.getReadableVersion() : '';

const DEVICE_MODEL = Platform.OS !== 'web' ? DeviceInfo.getModel() : 'Browser'; // TODO:

const SYSTEM_VERSION = Platform.OS !== 'web' ? DeviceInfo.getSystemVersion() : 'Web'; // TODO:

export default class UIDevice {
    static statusBarHeight(): number {
        return UI_STATUS_BAR_HEIGHT;
    }

    static navigationBarHeight(): number {
        return UI_NAVIGATION_BAR_HEIGHT;
    }

    static isDesktopWeb(): boolean {
        return UI_IS_DESKTOP_WEB;
    }

    static isMobileWeb(): boolean {
        return UI_IS_MOBILE_WEB;
    }

    static isTabletWeb(): boolean {
        return UI_IS_TABLET_WEB;
    }

    static isDesktop(): boolean {
        return UI_IS_DESKTOP_WEB; // TODO:
    }

    static isTablet(): boolean {
        return UI_IS_TABLET;
    }

    static isMobile(): boolean {
        return UI_IS_MOBILE;
    }

    static async isEmulator(): Promise<boolean> {
        return DeviceInfo.isEmulator();
    }

    static isWebkit(): boolean {
        return !Number.isNaN(UI_IS_WEBKIT);
    }

    static appName(): string {
        return APP_NAME;
    }

    static appVersion(): string {
        return APP_VERSION;
    }

    static deviceModel(): string {
        return DEVICE_MODEL;
    }

    static deviceOS(): string {
        if (Platform.OS === 'web') {
            if (UI_IS_MOBILE_WEB_IOS) {
                return 'ios';
            } else if (UI_IS_MOBILE_WEB_ANDROID) {
                return 'android';
            }
            return 'web';
        }
        return Platform.OS;
    }

    static systemVersion(): string {
        return SYSTEM_VERSION;
    }

    static imageScale(): string {
        const ratio = PixelRatio.get();

        let scale = '@3x';
        if (ratio < 2) {
            scale = '';
        } else if (ratio < 3) {
            scale = '@2x';
        }

        return scale;
    }
}
