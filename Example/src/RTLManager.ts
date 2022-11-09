import { I18nManager } from 'react-native';

const IS_RTL_KEY = 'isRTL';
const RTL_ENABLED = 'true';
const RTL_DISABLED = 'false';

/**
 * Recover isRTL from the localStorage
 */
export function recoverRTL() {
    const localStorageIsRTL = localStorage.getItem(IS_RTL_KEY) === RTL_ENABLED;
    if (I18nManager.getConstants().isRTL !== localStorageIsRTL) {
        I18nManager.forceRTL(localStorageIsRTL);
    }
}

export function switchRTL() {
    const newIsRTL = !I18nManager.getConstants().isRTL;
    localStorage.setItem(IS_RTL_KEY, newIsRTL ? RTL_ENABLED : RTL_DISABLED);
    I18nManager.forceRTL(newIsRTL);
}
