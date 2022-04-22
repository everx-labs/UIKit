import * as React from 'react';
import type {
    NativeSyntheticEvent,
    StyleProp,
    TextInput,
    TextInputContentSizeChangeEventData,
    TextStyle,
} from 'react-native';
import type { AutogrowAttributes, UITextViewProps } from '../types';

export function useAutogrow(
    ref: React.RefObject<TextInput>,
    textViewLineHeight: number,
    onContentSizeChangeProp: UITextViewProps['onContentSizeChange'],
    onChangeProp: UITextViewProps['onChange'],
    multiline: UITextViewProps['multiline'],
    maxNumberOfLines: UITextViewProps['maxNumberOfLines'],
    onHeightChange: UITextViewProps['onHeightChange'],
    onNumberOfLinesChange: UITextViewProps['onNumberOfLinesChange'],
): AutogrowAttributes {
    const inputHeightRef = React.useRef(0);

    const onContentHeightMaybeChanged = React.useCallback(
        function onContentHeightMaybeChanged(height: number) {
            if (height !== inputHeightRef.current) {
                inputHeightRef.current = height;

                if (onHeightChange) {
                    onHeightChange(height);
                }
                if (onNumberOfLinesChange) {
                    const numberOfLines = Math.round(height / textViewLineHeight);
                    onNumberOfLinesChange(numberOfLines);
                }
            }
        },
        [onHeightChange, onNumberOfLinesChange, textViewLineHeight],
    );

    const onMeasure = React.useCallback(
        function onMeasure(_x, _y, _width, height) {
            onContentHeightMaybeChanged(height);
        },
        [onContentHeightMaybeChanged],
    );

    const remeasureInputHeight = React.useCallback(
        function remeasureInputHeight() {
            if (multiline) {
                ref.current?.measure(onMeasure);
            }
        },
        [onMeasure, ref, multiline],
    );

    const onContentSizeChange = React.useCallback(
        function onContentSizeChange(
            event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
        ) {
            remeasureInputHeight();

            if (onContentSizeChangeProp) {
                onContentSizeChangeProp(event);
            }
        },
        [onContentSizeChangeProp, remeasureInputHeight],
    );

    const autogrowStyle = React.useMemo<StyleProp<TextStyle>>(
        function getAutogrowStyle() {
            if (multiline && maxNumberOfLines) {
                return {
                    maxHeight: maxNumberOfLines * textViewLineHeight,
                };
            }
            return null;
        },
        [maxNumberOfLines, multiline, textViewLineHeight],
    );

    return {
        onContentSizeChange,
        onChange: onChangeProp,
        numberOfLines: undefined,
        remeasureInputHeight,
        autogrowStyle,
    };
}
