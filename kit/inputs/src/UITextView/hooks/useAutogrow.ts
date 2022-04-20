import * as React from 'react';
import {
    LayoutAnimation,
    NativeSyntheticEvent,
    StyleProp,
    TextInput,
    TextInputContentSizeChangeEventData,
    TextStyle,
} from 'react-native';
import type { AutogrowAttributes, UITextViewProps } from '../types';

export function useAutogrow(
    _ref: React.Ref<TextInput>,
    textViewLineHeight: number,
    onContentSizeChangeProp: UITextViewProps['onContentSizeChange'],
    onChangeProp: UITextViewProps['onChange'],
    multiline: UITextViewProps['multiline'],
    maxNumberOfLines: UITextViewProps['maxNumberOfLines'],
    onHeightChange: UITextViewProps['onHeightChange'],
): AutogrowAttributes {
    const inputHeight = React.useRef(0);

    const onContentSizeChange = React.useCallback(
        (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

    const remeasureInputHeight = React.useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, []);

    const autogrowStyle = React.useMemo<StyleProp<TextStyle>>(() => {
        if (multiline && maxNumberOfLines) {
            return {
                maxHeight: maxNumberOfLines * textViewLineHeight,
            };
        }
        return null;
    }, [maxNumberOfLines, multiline, textViewLineHeight]);

    return {
        onContentSizeChange,
        onChange: onChangeProp,
        numberOfLines: undefined,
        remeasureInputHeight,
        autogrowStyle,
    };
}
