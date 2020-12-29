import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';

import {
    UIMaterialTextView,
    UIMaterialTextViewProps,
} from './UIMaterialTextView';

export type UISeedPhraseTextViewProps = Omit<UIMaterialTextViewProps, 'label'>;

export const UISeedPhraseTextView = React.forwardRef<
    TextInput,
    UISeedPhraseTextViewProps
>(function UIDecoratedTextViewForwarded(props: UISeedPhraseTextViewProps, ref) {
    const textInputRef = React.useRef(null);
    const refToUse = ref || textInputRef;

    return (
        <UIMaterialTextView
            ref={refToUse}
            {...props}
            label={uiLocalized.MasterPassword}
            onChangeText={(text: string) => {
                if (text[text.length - 1] === ' ') {
                    const newText = `${text}- `;
                    if (refToUse && 'current' in refToUse) {
                        refToUse.current?.setNativeProps({
                            text: newText,
                        });
                    }
                }
            }}
        />
    );
});

const styles = StyleSheet.create({});
