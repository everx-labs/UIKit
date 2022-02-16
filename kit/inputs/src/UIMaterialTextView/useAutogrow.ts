import * as React from 'react';
import {
    TextInput,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    StyleSheet,
} from 'react-native';

import { OnHeightChange, useAutogrowTextView } from '../useAutogrowTextView';
import type { UIMaterialTextViewProps } from './types';

export function useAutogrow(
    ref: React.Ref<TextInput>,
    onContentSizeChangeProp: UIMaterialTextViewProps['onContentSizeChange'],
    onChangeProp: UIMaterialTextViewProps['onChange'],
    multiline: UIMaterialTextViewProps['multiline'],
    numberOfLines: UIMaterialTextViewProps['numberOfLines'],
    onHeightChange?: OnHeightChange,
) {
    const {
        onContentSizeChange: onAutogrowContentSizeChange,
        onChange: onAutogrowChange,
        inputHeight,
        numberOfLinesProp,
        resetInputHeight,
    } = useAutogrowTextView(ref, onHeightChange, multiline ? numberOfLines : 1);

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

    const style = React.useMemo(() => [styles.input, { height: inputHeight }], [inputHeight]);

    if (!multiline) {
        return {
            onContentSizeChange: onContentSizeChangeProp,
            onChange: onChangeProp,
            resetInputHeight,
            numberOfLines,
            style: styles.input,
        };
    }

    return {
        onContentSizeChange,
        onChange,
        resetInputHeight,
        numberOfLines: numberOfLinesProp,
        style,
    };
}

const styles = StyleSheet.create({
    input: {
        minHeight: 24, // At least size of right icons to not jump
    },
});
