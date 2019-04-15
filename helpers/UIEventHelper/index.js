// @flow
import { Linking, Platform } from 'react-native';

export default class UIEventHelper {
    static checkEventTarget(e: any, className: string) {
        const triggers = Array.from(document.getElementsByClassName(className));
        if (triggers && triggers.length) {
            return triggers.reduce((contains, trigger) => {
                if (!contains) {
                    return trigger.contains(e.target);
                }
                return contains;
            }, false);
        }
        return false;
    }

    static observePopState() {
        if (Platform.OS !== 'web') {
            return;
        }

        window.onpopstate = (event) => {
            const { target } = event;
            if (!target) return;

            const { location } = target;
            if (!location) return;

            // This will "refresh" the browser, that means that the "lock" screen will appear.
            // TODO: Need to find a way to navigate without "refreshing" the browser.
            Linking.openURL(location.href);
        };
    }
}
