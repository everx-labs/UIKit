import * as React from 'react';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { UIAmountInputProps } from '../types';
import { useTextViewHandler } from '../../useTextViewHandler';
import { AmountInputContext, UIConstants } from '../constants';
import { useAmountMaskApplyer } from './amountMask';
import { injectInputValue } from '../InputValueInjector';
import type { UITextViewRef } from '../../UITextView';

export function useAmountInputHandlers(
    ref: React.RefObject<UITextViewRef>,
    editableProp: UIAmountInputProps['editable'],
    onFocusProp: UIAmountInputProps['onFocus'],
    onBlurProp: UIAmountInputProps['onBlur'],
    onSelectionChangeProp: UIAmountInputProps['onSelectionChange'],
    precision: UIAmountInputProps['precision'],
) {
    const { isFocused, formattedText, carretEndPosition } = React.useContext(AmountInputContext);

    const editableAnimated = useDerivedValue(() => editableProp, [editableProp]);

    const numberOfDecimalDigits = React.useMemo(() => {
        switch (precision) {
            case 'Integer':
                return UIConstants.decimalAspect.integer;
            case 'Currency':
                return UIConstants.decimalAspect.currency;
            case 'Precise':
            default:
                return UIConstants.decimalAspect.precision;
        }
    }, [precision]);

    const skipNextOnSelectionChange = useSharedValue(false);

    const applyAmountMask = useAmountMaskApplyer(
        numberOfDecimalDigits,
        carretEndPosition,
        skipNextOnSelectionChange,
    );

    // const inputManager = useInputManager(ref);

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

            const {
                formattedText: newFormattedText,
                carretPosition: newCarretPosition,
                // normalizedText: newNormalizedText,
            } = applyAmountMask(evt.text);

            if (evt.text !== newFormattedText) {
                // getInputManager(ref)?.injectValue(newFormattedText);
                // inputManager.value.injectValue(newFormattedText);
                injectInputValue(ref, newFormattedText);
                // console.log({
                //     text: evt.text,
                //     newFormattedText,
                // });
            }

            // inputText.value = evt.text;
            formattedText.value = newFormattedText;
            carretEndPosition.value = newCarretPosition;
            // normalizedText.value = newNormalizedText;
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
