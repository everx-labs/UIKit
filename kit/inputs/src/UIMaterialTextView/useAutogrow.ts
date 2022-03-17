import * as React from 'react';
import type { TextInput } from 'react-native';
import type { OnHeightChange } from '../useAutogrowTextView';
import type { UIMaterialTextViewProps, AutogrowAttributes } from './types';

export function useAutogrow(
    _ref: React.Ref<TextInput>,
    onContentSizeChangeProp: UIMaterialTextViewProps['onContentSizeChange'],
    onChangeProp: UIMaterialTextViewProps['onChange'],
    _multiline: UIMaterialTextViewProps['multiline'],
    numberOfLinesProp: UIMaterialTextViewProps['numberOfLines'],
    onHeightChange: OnHeightChange | undefined,
    _isHovered: boolean,
    _isFocused: boolean,
): AutogrowAttributes {
    const inputHeight = React.useRef(0);

    const onContentSizeChange = React.useCallback(
        (event: any) => {
            if (onHeightChange) {
                const height = event?.nativeEvent?.contentSize?.height;
                if (height !== inputHeight.current) {
                    inputHeight.current = height;
                    if (typeof height === 'number') {
                        onHeightChange(height);
                    } else {
                        onHeightChange(0);
                    }
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
        resetInputHeight: () => null,
        numberOfLines: numberOfLinesProp,
    };
}
