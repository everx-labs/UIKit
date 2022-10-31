import { I18nManager, NativeModules } from 'react-native';

/**
 * Recover isRTL from the localStorage
 */
export function recoverRTL() {
    // TODO Add if need.
}

export function switchRTL() {
    const newIsRTL = !I18nManager.getConstants().isRTL;
    I18nManager.forceRTL(newIsRTL);
    NativeModules.DevSettings.reload();
}
