import * as React from 'react';
import {
    TextInput,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    StyleSheet,
    Platform,
} from 'react-native';

import { OnHeightChange, useAutogrowTextView } from '../../useAutogrowTextView';
import type { UIMaterialTextViewProps } from '../types';

export function useAutogrow(
    ref: React.Ref<TextInput>,
    onContentSizeChangeProp: UIMaterialTextViewProps['onContentSizeChange'],
    onChangeProp: UIMaterialTextViewProps['onChange'],
    multiline: UIMaterialTextViewProps['multiline'],
    numberOfLinesProp: UIMaterialTextViewProps['numberOfLines'],
    onHeightChange?: OnHeightChange,
) {
    const {
        onContentSizeChange: onAutogrowContentSizeChange,
        onChange: onAutogrowChange,
        inputHeight,
        numberOfLines,
        resetInputHeight,
    } = useAutogrowTextView(ref, onHeightChange, multiline ? numberOfLinesProp : 1);

    const onContentSizeChange = React.useCallback(
        (event: any) => {
            if (onAutogrowContentSizeChange) {
                onAutogrowContentSizeChange(event);
            }

            if (onContentSizeChangeProp) {
                onContentSizeChangeProp(event);
            }
        },
        [onAutogrowContentSizeChange, onContentSizeChangeProp],
    );

    const onChange = React.useCallback(
        (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
            if (onAutogrowChange) {
                onAutogrowChange(event);
            }

            if (onChangeProp) {
                onChangeProp(event);
            }
        },
        [onAutogrowChange, onChangeProp],
    );

    const style = React.useMemo(
        () => [
            styles.input,
            Platform.select({
                web: { height: inputHeight },
            }),
        ],
        [inputHeight],
    );

    if (!multiline) {
        return {
            onContentSizeChange: onContentSizeChangeProp,
            onChange: onChangeProp,
            resetInputHeight,
            numberOfLinesProp,
            style: styles.input,
        };
    }

    return {
        onContentSizeChange,
        onChange,
        resetInputHeight,
        numberOfLines,
        style,
    };
}

const styles = StyleSheet.create({
    input: {
        minHeight: 24, // At least size of right icons to not jump
    },
});
