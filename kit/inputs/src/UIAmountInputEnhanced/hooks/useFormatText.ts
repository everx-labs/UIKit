import * as React from 'react';
import { Platform } from 'react-native';
import { SharedValue, useWorkletCallback } from 'react-native-reanimated';
import { AmountInputContext, UIAmountInputEnhancedDecimalAspect, UIConstants } from '../constants';
import type { UIAmountInputEnhancedProps } from '../types';
import { useAmountMaskApplyer } from './amountMask';
import { useDerivedReactValue } from './hooks';

export function useFormatText(
    decimalAspect: UIAmountInputEnhancedProps['decimalAspect'],
    multiline: UIAmountInputEnhancedProps['multiline'],
    prevCaretPosition: SharedValue<number>,
): (text: string) => {
    formattedText: string;
    normalizedText: string;
    caretPosition: number;
} {
    const { selectionEndPosition } = React.useContext(AmountInputContext);

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

    const formatText = useWorkletCallback((text: string) => {
        'worklet';

        const {
            formattedText: newFormattedText,
            caretPosition: newCaretPosition,
            normalizedText: newNormalizedText,
        } = applyAmountMask(
            text,
            platformOS.value === 'ios' && multilineAnimated.value
                ? prevCaretPosition
                : selectionEndPosition,
        );

        return {
            formattedText: newFormattedText,
            caretPosition: newCaretPosition,
            normalizedText: newNormalizedText,
        };
    });

    return formatText;
}
