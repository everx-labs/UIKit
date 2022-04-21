import * as React from 'react';
import {
    LayoutAnimation,
    NativeSyntheticEvent,
    Platform,
    StyleProp,
    TextInput,
    TextInputContentSizeChangeEventData,
    TextStyle,
} from 'react-native';
import type { AutogrowAttributes, UITextViewProps } from '../types';

export const EXTRA_HEIGHT_OF_MULTILINE_INPUT = Platform.OS === 'ios' ? 5 : 0;

export function useAutogrow(
    ref: React.RefObject<TextInput>,
    textViewLineHeight: number,
    onContentSizeChangeProp: UITextViewProps['onContentSizeChange'],
    onChangeProp: UITextViewProps['onChange'],
    multiline: UITextViewProps['multiline'],
    maxNumberOfLines: UITextViewProps['maxNumberOfLines'],
    onHeightChange: UITextViewProps['onHeightChange'],
): AutogrowAttributes {
    const inputHeightRef = React.useRef(0);

    const onContentHeightMaybeChanged = React.useCallback(
        function onContentHeightMaybeChanged(height: number) {
            if (height !== inputHeightRef.current) {
                /**
                 * We don't need to animate the first render.
                 */
                if (Platform.OS === 'ios' && inputHeightRef.current !== 0) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }

                inputHeightRef.current = height;

                if (onHeightChange) {
                    onHeightChange(height);
                }
            }
        },
        [onHeightChange],
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
                    maxHeight:
                        maxNumberOfLines * textViewLineHeight + EXTRA_HEIGHT_OF_MULTILINE_INPUT,
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
