import * as React from 'react';
import { runOnJS, SharedValue } from 'react-native-reanimated';
import type { FormatText, SetText, UIAmountInputProps } from '../types';
import { useTextViewHandler } from '../../useTextViewHandler';
import { AmountInputContext } from '../constants';
import { useDerivedReactValue } from './useDerivedReactValue';

export function useAmountInputHandlers(
    editableProp: UIAmountInputProps['editable'],
    onFocusProp: UIAmountInputProps['onFocus'],
    onBlurProp: UIAmountInputProps['onBlur'],
    onSelectionChangeProp: UIAmountInputProps['onSelectionChange'],
    formatText: FormatText,
    setText: SetText,
    prevCaretPosition: SharedValue<number>,
) {
    const { isFocused, selectionEndPosition, formattedText } = React.useContext(AmountInputContext);

    const editableAnimated = useDerivedReactValue(editableProp);

    const textViewHandlers = useTextViewHandler(
        {
            onFocus: evt => {
                'worklet';

                /**
                 * Input still fire focus/blur events on web, even thought input isn't editable.
                 */
                if (editableAnimated.value === false) {
                    return;
                }

                isFocused.value = true;

                if (onFocusProp != null) {
                    runOnJS(onFocusProp)({ nativeEvent: evt } as any);
                }
            },
            onBlur: evt => {
                'worklet';

                /**
                 * Input still fire focus/blur events on web, even thought input isn't editable.
                 */
                if (editableAnimated.value === false) {
                    return;
                }

                isFocused.value = false;

                if (onBlurProp != null) {
                    runOnJS(onBlurProp)({ nativeEvent: evt } as any);
                }
            },
            onChange: evt => {
                'worklet';

                /**
                 * Nothing was changed
                 */
                if (formattedText.value === evt.text) {
                    return;
                }

                const textAttributes = formatText(evt.text);
                setText(textAttributes, {
                    shouldSetText: textAttributes.formattedText !== evt.text,
                });
            },
            onSelectionChange: evt => {
                'worklet';

                if (onSelectionChangeProp != null) {
                    runOnJS(onSelectionChangeProp)({ nativeEvent: evt } as any);
                }

                // eslint-disable-next-line no-param-reassign
                prevCaretPosition.value = selectionEndPosition.value;
                selectionEndPosition.value = evt.selection.end;
            },
        },
        [onFocusProp, onBlurProp, onSelectionChangeProp, setText, formatText],
    );

    return textViewHandlers;
}
