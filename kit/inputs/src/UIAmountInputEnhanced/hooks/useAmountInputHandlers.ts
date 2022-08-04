import * as React from 'react';
import { runOnJS, useAnimatedRef, useSharedValue } from 'react-native-reanimated';
import { Platform } from 'react-native';
import type { UIAmountInputEnhancedProps } from '../types';
import { useTextViewHandler } from '../../useTextViewHandler';
import { AmountInputContext, UIConstants } from '../constants';
import { useAmountMaskApplyer } from './amountMask';
import { setTextAndCaretPosition } from '../setTextAndCaretPosition';
import type { UITextViewRef } from '../../UITextView';
import { useDerivedReactValue } from './hooks';

export function useAmountInputHandlers(
    ref: React.RefObject<UITextViewRef>,
    editableProp: UIAmountInputEnhancedProps['editable'],
    onFocusProp: UIAmountInputEnhancedProps['onFocus'],
    onBlurProp: UIAmountInputEnhancedProps['onBlur'],
    onSelectionChangeProp: UIAmountInputEnhancedProps['onSelectionChange'],
    precision: UIAmountInputEnhancedProps['precision'],
    multiline: UIAmountInputEnhancedProps['multiline'],
) {
    const { isFocused, formattedText, carretEndPosition } = React.useContext(AmountInputContext);

    const prevCarretPosition = useSharedValue(carretEndPosition.value);

    const platformOS = useDerivedReactValue(Platform.OS);
    const editableAnimated = useDerivedReactValue(editableProp);
    const multilineAnimated = useDerivedReactValue(multiline);

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

    const applyAmountMask = useAmountMaskApplyer(numberOfDecimalDigits);

    // @ts-expect-error
    const inputManagerRef = useAnimatedRef<InputController | undefined>();

    // const injectInputValue1 = useInjectInputValue(ref)

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

                const {
                    formattedText: newFormattedText,
                    carretPosition: newCaretPosition,
                    // normalizedText: newNormalizedText,
                } = applyAmountMask(
                    evt.text,
                    platformOS.value === 'ios' && multilineAnimated.value
                        ? prevCarretPosition
                        : carretEndPosition,
                );

                if (evt.text !== newFormattedText) {
                    setTextAndCaretPosition(
                        ref,
                        inputManagerRef,
                        newFormattedText,
                        newCaretPosition,
                    );
                }

                // inputText.value = evt.text;
                formattedText.value = newFormattedText;
                carretEndPosition.value = newCaretPosition;
                // normalizedText.value = newNormalizedText;
            },
            onSelectionChange: evt => {
                'worklet';

                if (onSelectionChangeProp != null) {
                    runOnJS(onSelectionChangeProp)({ nativeEvent: evt } as any);
                }

                prevCarretPosition.value = carretEndPosition.value;
                carretEndPosition.value = evt.selection.end;
            },
        },
        [onFocusProp, onBlurProp, onSelectionChangeProp],
    );

    return textViewHandlers;
}
