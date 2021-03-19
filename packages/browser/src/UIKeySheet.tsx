import * as React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { UIKeyTextView } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UIPullerSheet } from './UIPullerSheet';

// We wrap it with a component to be able
// to focus input on every new sheet mounting
function UIKeySheetContent() {
    const keyRef = React.useRef<TextInput>(null);

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
            />
        </View>
    );
}

export function UIKeySheet({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIKeySheetContent />
        </UIPullerSheet>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
    },
});
