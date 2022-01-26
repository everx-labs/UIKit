import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { UIKeyTextView, UIMaterialTextViewRef } from '@tonlabs/uikit.inputs';
import { UIBoxButton } from '@tonlabs/uikit.controls';

import { UIPullerSheet } from './UIPullerSheet';

function useKeySheetContent() {
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const key = React.useRef('');
    const setKey = React.useCallback((val: string) => {
        key.current = val;
    }, []);

    return { error, setError, success, setSuccess, key, setKey };
}

// We wrap it with a component to be able
// to focus input on every new sheet mounting
function UIKeySheetContent({
    onKeyRetrieved,
    label,
    buttonTitle,
}: {
    onKeyRetrieved: (key: string) => void;
    label: string;
    buttonTitle: string;
}) {
    const keyRef = React.useRef<UIMaterialTextViewRef>(null);
    const { success, setSuccess, error, setError, key, setKey } = useKeySheetContent();

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

    const onSend = React.useCallback(() => {
        if (success) {
            onKeyRetrieved(key.current);
        }
    }, [key, success]);

    return (
        <View style={styles.wrapper}>
            <UIKeyTextView
                ref={keyRef}
                label={label}
                onDone={onKeyRetrieved}
                onSuccess={setSuccess}
                onError={setError}
                onChangeText={setKey}
            />
            <UIBoxButton onPress={onSend} disabled={!success || error} title={buttonTitle} />
        </View>
    );
}

export function UIKeySheet({
    visible,
    onClose,
    onKeyRetrieved,
    label,
    buttonTitle,
}: {
    visible: boolean;
    onClose: () => void;
    onKeyRetrieved: (key: string) => void;
    label: string;
    buttonTitle: string;
}) {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIKeySheetContent
                onKeyRetrieved={onKeyRetrieved}
                label={label}
                buttonTitle={buttonTitle}
            />
        </UIPullerSheet>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
    },
});
