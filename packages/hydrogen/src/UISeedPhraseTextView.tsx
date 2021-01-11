import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
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

    const savedText = React.useRef('');

    return (
        <UIMaterialTextView
            ref={refToUse}
            {...props}
            label={uiLocalized.MasterPassword}
            onChangeText={(text: string) => {
                const lastSymbol = text[text.length - 1];

                if (
                    text.length > savedText.current.length &&
                    lastSymbol === ' '
                ) {
                    const newText = `${text}${UIConstant.dashSymbol()} `;

                    if (refToUse && 'current' in refToUse) {
                        refToUse.current?.setNativeProps({
                            text: newText,
                        });
                    }

                    savedText.current = newText;
                    return;
                }

                if (
                    text.length < savedText.current.length &&
                    lastSymbol === UIConstant.dashSymbol()
                ) {
                    const newText = text.slice(0, text.length - 2);

                    if (refToUse && 'current' in refToUse) {
                        refToUse.current?.setNativeProps({
                            text: newText,
                        });
                    }

                    savedText.current = newText;
                    return;
                }

                savedText.current = text;
            }}
        />
    );
});

const styles = StyleSheet.create({});
