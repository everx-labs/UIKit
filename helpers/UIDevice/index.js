// @flow
import { Platform } from 'react-native';
import SafeArea from 'react-native-safe-area';
import MobileDetect from 'mobile-detect';
import DeviceInfo from 'react-native-device-info';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export type SafeAreaInsets = {
    top: number,
    left: number,
    right: number,
    bottom: number,
};

const UI_STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
const UI_NAVIGATION_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const UI_IS_DESKTOP_WEB = Platform.OS === 'web'
        && !(new MobileDetect(window.navigator.userAgent)).mobile();

const UI_IS_MOBILE_WEB = Platform.OS === 'web'
    && (new MobileDetect(window.navigator.userAgent)).phone();

const UI_IS_TABLET_WEB = Platform.OS === 'web'
        && (new MobileDetect(window.navigator.userAgent)).tablet();

const UI_IS_TABLET = Platform.OS !== 'web' ? DeviceInfo.isTabletSync() : UI_IS_TABLET_WEB;

const UI_IS_MOBILE = Platform.OS !== 'web' ? !DeviceInfo.isTabletSync() : UI_IS_MOBILE_WEB;

const APP_NAME = Platform.OS !== 'web' ? DeviceInfo.getApplicationNameSync() : '';

const APP_VERSION = Platform.OS !== 'web' ? DeviceInfo.getVersionSync() : '';

const APP_READABLE_VERSION = Platform.OS !== 'web' ? DeviceInfo.getReadableVersionSync() : '';

const DEVICE_MODEL = Platform.OS !== 'web' ? DeviceInfo.getModelSync() : 'Browser'; // TODO:

const SYSTEM_VERSION = Platform.OS !== 'web' ? DeviceInfo.getSystemVersionSync() : 'Web'; // TODO:

export default class UIDevice {
    static statusBarHeight(): number {
        return UI_STATUS_BAR_HEIGHT;
    }

    static navigationBarHeight(): number {
        return UI_NAVIGATION_BAR_HEIGHT;
    }

    static async safeAreaInsets(): Promise<SafeAreaInsets> {
        if (SafeArea.getSafeAreaInsetsForRootView) {
            try {
                const { safeAreaInsets } = await SafeArea.getSafeAreaInsetsForRootView();
                return safeAreaInsets;
            } catch (error) {
                console.warn('Failed to get safe area insets with error:', error);
            }
        }
        return {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        };
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

    static appName(): string {
        return APP_NAME;
    }

    static appVersion(): string {
        return APP_VERSION;
    }

    static appReadableVersion(): string {
        return APP_READABLE_VERSION;
    }

    static deviceModel(): string {
        return DEVICE_MODEL;
    }

    static systemVersion(): string {
        return SYSTEM_VERSION;
    }
}
