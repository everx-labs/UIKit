import type * as React from 'react';
import type { TextInput } from 'react-native';
import type { OnHeightChange } from '../useAutogrowTextView';
import type { UIMaterialTextViewProps } from './types';

export function useAutogrow(
    _ref: React.Ref<TextInput>,
    onContentSizeChangeProp: UIMaterialTextViewProps['onContentSizeChange'],
    onChangeProp: UIMaterialTextViewProps['onChange'],
    _multiline: UIMaterialTextViewProps['multiline'],
    numberOfLinesProp: UIMaterialTextViewProps['numberOfLines'],
    _onHeightChange?: OnHeightChange,
) {
    return {
        onContentSizeChange: onContentSizeChangeProp,
        onChange: onChangeProp,
        resetInputHeight: () => null,
        numberOfLines: numberOfLinesProp,
        style: null,
    };
}
