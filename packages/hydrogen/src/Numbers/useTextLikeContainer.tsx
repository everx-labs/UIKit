import * as React from 'react';
import { StyleSheet, I18nManager } from 'react-native';

export function useTextLikeContainer() {
    return React.useMemo(() => {
        if (I18nManager.isRTL) {
            return styles.rtlContainer;
        }
        return styles.ltrContainer;
    }, []);
}

const styles = StyleSheet.create({
    ltrContainer: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    // On RTL RN will reverse `flex-direction` so to draw
    // it properly we should reverse it again
    // as it is a "text-like" container
    // and text in RTL is shown as usual
    rtlContainer: {
        position: 'relative',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
    },
});
