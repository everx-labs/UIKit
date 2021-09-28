import * as React from 'react';
import { StyleSheet, I18nManager } from 'react-native';

export function useTextLikeContainer() {
    return React.useMemo(
        () => (I18nManager.isRTL ? styles.rtlContainer : styles.ltrContainer),
        [I18nManager.isRTL],
    );
}

const styles = StyleSheet.create({
    ltrContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    // On RTL RN will reverse `flex-direction` so to draw
    // it properly we should reverse it again
    // as it is a "text-like" container
    // and text in RTL is shown as usual
    rtlContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
    },
});
