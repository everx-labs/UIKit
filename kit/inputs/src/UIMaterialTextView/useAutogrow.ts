import * as React from 'react';
import {
    TextInput,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    StyleSheet,
    Platform,
} from 'react-native';

import { OnHeightChange, useAutogrowTextView } from '../useAutogrowTextView';
import type { UIMaterialTextViewProps } from './types';

/**
 * It is not known why, but experimentally it was possible to establish
 * that the `onContentSizeChangeProp` returns the height by about 4.5 less than the real size on iOS.
 * This is necessary so that the text in the input is not cut off
 */
const HEIGHT_CORRECTION = Platform.OS === 'ios' ? 4.5 : 0;

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

    const style = React.useMemo(
        () => [styles.input, { height: inputHeight + HEIGHT_CORRECTION }],
        [inputHeight],
    );

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
