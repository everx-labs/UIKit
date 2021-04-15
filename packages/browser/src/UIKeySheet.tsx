import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { UIKeyTextView, UIMaterialTextViewRef } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UIPullerSheet } from './UIPullerSheet';

// We wrap it with a component to be able
// to focus input on every new sheet mounting
function UIKeySheetContent({
    onKeyRetrieved,
}: {
    onKeyRetrieved: (key: string) => void;
}) {
    const keyRef = React.useRef<UIMaterialTextViewRef>(null);

    React.useLayoutEffect(() => {
        function focus() {
            if (keyRef.current) {
                keyRef.current.focus();
                return;
            }
            requestAnimationFrame(focus);
        }
        // For now UISheet not working good with
        // UIMaterialTextView and autoFocus
        // So we have to apply a little delay before focus it
        setTimeout(focus, 300);
    }, []);

    return (
        <View style={styles.wrapper}>
            <UIKeyTextView
                ref={keyRef}
                label={uiLocalized.Browser.SigningBox.PrivateKey}
                onDone={onKeyRetrieved}
            />
        </View>
    );
}

export function UIKeySheet({
    visible,
    onClose,
    onKeyRetrieved,
}: {
    visible: boolean;
    onClose: () => void;
    onKeyRetrieved: (key: string) => void;
}) {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIKeySheetContent onKeyRetrieved={onKeyRetrieved} />
        </UIPullerSheet>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
    },
});
