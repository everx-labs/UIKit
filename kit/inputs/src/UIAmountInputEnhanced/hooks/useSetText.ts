import * as React from 'react';
import { Platform } from 'react-native';
import { SharedValue, useAnimatedRef, useWorkletCallback } from 'react-native-reanimated';
import type { UITextViewRef } from '../../UITextView/types';
import { AmountInputContext, UIAmountInputEnhancedDecimalAspect, UIConstants } from '../constants';
import { setTextAndCaretPosition } from '../setTextAndCaretPosition';
import type { UIAmountInputEnhancedProps } from '../types';
import { useAmountMaskApplyer } from './amountMask';
import { useDerivedReactValue } from './hooks';

export function useSetText(
    ref: React.RefObject<UITextViewRef>,
    decimalAspect: UIAmountInputEnhancedProps['decimalAspect'],
    multiline: UIAmountInputEnhancedProps['multiline'],
    prevCaretPosition: SharedValue<number>,
) {
    // @ts-expect-error
    const inputManagerRef = useAnimatedRef<InputController | undefined>();

    const { formattedText, selectionEndPosition, normalizedText } =
        React.useContext(AmountInputContext);

    const platformOS = useDerivedReactValue(Platform.OS);
    const multilineAnimated = useDerivedReactValue(multiline);
    const numberOfDecimalDigits = React.useMemo(() => {
        switch (decimalAspect) {
            case UIAmountInputEnhancedDecimalAspect.Integer:
                return UIConstants.decimalAspect.integer;
            case UIAmountInputEnhancedDecimalAspect.Currency:
                return UIConstants.decimalAspect.currency;
            case UIAmountInputEnhancedDecimalAspect.Precision:
            default:
                return UIConstants.decimalAspect.precision;
        }
    }, [decimalAspect]);

    const applyAmountMask = useAmountMaskApplyer(numberOfDecimalDigits);

    return useWorkletCallback((text: string): void => {
        'worklet';

        const {
            formattedText: newFormattedText,
            carretPosition: newCaretPosition,
            normalizedText: newNormalizedText,
        } = applyAmountMask(
            text,
            platformOS.value === 'ios' && multilineAnimated.value
                ? prevCaretPosition
                : selectionEndPosition,
        );

        if (text !== newFormattedText) {
            setTextAndCaretPosition(ref, inputManagerRef, newFormattedText, newCaretPosition);
        }

        formattedText.value = newFormattedText;
        selectionEndPosition.value = newCaretPosition;
        normalizedText.value = newNormalizedText;
    });
}
