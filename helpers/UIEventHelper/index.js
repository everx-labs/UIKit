// @flow
import { Linking, Platform } from 'react-native';

let prevPath = null;

export default class UIEventHelper {
    /**
     * @deprecated method. Since react-native-web@^0.12.0 stopped using `className`
     */
    static checkEventTarget(e: any, className: string, exceptionClassName?: string) {
        if (exceptionClassName
            && e.target?.className?.includes
            && e.target.className.includes(exceptionClassName)) {
            return true;
        }

        if (className) {
            const triggers = Array.from(document.getElementsByClassName(className));
            if (triggers?.length) {
                return triggers.reduce((contains, trigger) => {
                    if (!contains) {
                        return trigger.contains(e.target);
                    }
                    return contains;
                }, false);
            }
        }

        return false;
    }

    static observePopState() {
        if (Platform.OS !== 'web') {
            return;
        }

        window.onpopstate = (event) => {
            const { target } = event;
            if (!target) {
                return;
            }
            const { location } = target;
            if (!location) {
                return;
            }
            // Normalize path
            const path = `${location.pathname.replace('/', '')}${location.search}`;
            if (prevPath === path) {
                return; // Don't handle the same path twice
            }
            prevPath = path;
            // This will "refresh" the browser, that means that the "lock" screen will appear.
            // TODO: Need to find a way to navigate without "refreshing" the browser.
            Linking.openURL(path);
        };
    }

    static pushHistory(path: string) {
        const { history } = window;
        if (history?.pushState) {
            if (prevPath !== null) {
                history.pushState(null, '', `/${path}`);
            }
            prevPath = path; // Path is already normalized
        }
    }
}
