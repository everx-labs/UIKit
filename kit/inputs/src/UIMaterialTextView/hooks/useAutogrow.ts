import * as React from 'react';
import type {
    NativeSyntheticEvent,
    TextInput,
    TextInputContentSizeChangeEventData,
} from 'react-native';
import type { UIMaterialTextViewProps, AutogrowAttributes } from '../types';

export function useAutogrow(
    _ref: React.Ref<TextInput>,
    onContentSizeChangeProp: UIMaterialTextViewProps['onContentSizeChange'],
    onChangeProp: UIMaterialTextViewProps['onChange'],
    _multiline: UIMaterialTextViewProps['multiline'],
    numberOfLinesProp: UIMaterialTextViewProps['numberOfLines'],
    onHeightChange: UIMaterialTextViewProps['onHeightChange'],
    _isHovered: boolean,
    _isFocused: boolean,
): AutogrowAttributes {
    const inputHeight = React.useRef(0);

    const onContentSizeChange = React.useCallback(
        (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
            if (onHeightChange) {
                const { height } = event.nativeEvent.contentSize;
                if (height !== inputHeight.current) {
                    inputHeight.current = height;
                    onHeightChange(height);
                }
            }

            if (onContentSizeChangeProp) {
                onContentSizeChangeProp(event);
            }
        },
        [onHeightChange, onContentSizeChangeProp],
    );

    return {
        onContentSizeChange,
        onChange: onChangeProp,
        numberOfLines: numberOfLinesProp,
        remeasureInputHeight: () => null,
    };
}
