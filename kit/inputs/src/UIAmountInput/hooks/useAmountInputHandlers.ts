import * as React from 'react';
import { runOnJS, useDerivedValue } from 'react-native-reanimated';
import type { UIAmountInputProps } from '../types';
import { useTextViewHandler } from '../../useTextViewHandler';
import { AmountInputContext } from '../constants';

export function useAmountInputHandlers(
    editableProp: boolean | undefined,
    onFocusProp: UIAmountInputProps['onFocus'],
    onBlurProp: UIAmountInputProps['onBlur'],
    onSelectionChangeProp: UIAmountInputProps['onSelectionChange'],
) {
    const { isFocused, inputText, formattedText, carretEndPosition } =
        React.useContext(AmountInputContext);

    const editableAnimated = useDerivedValue(() => editableProp, [editableProp]);

    const textViewHandlers = useTextViewHandler({
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

            // const { formattedText, carretPosition } = applyMask(evt.text);

            inputText.value = evt.text;
            formattedText.value = evt.text;

            // runOnJS(appointTextChange)(formattedText, carretPosition, {
            //     shouldSetNativeProps: formattedText !== evt.text,
            // });
        },
        onSelectionChange: evt => {
            'worklet';

            if (onSelectionChangeProp != null) {
                runOnJS(onSelectionChangeProp)({ nativeEvent: evt } as any);
            }
        },
    });

    return textViewHandlers;
}
