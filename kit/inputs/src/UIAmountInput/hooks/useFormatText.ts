import * as React from 'react';
import { Platform } from 'react-native';
import { SharedValue, useWorkletCallback } from 'react-native-reanimated';
import { AmountInputContext, UIConstants } from '../constants';
import { FormatText, UIAmountInputProps, UIAmountInputDecimalAspect } from '../types';
import { useAmountMaskApplyer } from './amountMask';
import { useDerivedReactValue } from './hooks';

export function useFormatText(
    decimalAspect: UIAmountInputProps['decimalAspect'],
    multiline: UIAmountInputProps['multiline'],
    prevCaretPosition: SharedValue<number>,
): FormatText {
    const { selectionEndPosition } = React.useContext(AmountInputContext);

    const platformOS = useDerivedReactValue(Platform.OS);
    const multilineAnimated = useDerivedReactValue(multiline);
    const numberOfDecimalDigits = React.useMemo(() => {
        switch (decimalAspect) {
            case UIAmountInputDecimalAspect.Integer:
                return UIConstants.decimalAspect.integer;
            case UIAmountInputDecimalAspect.Currency:
                return UIConstants.decimalAspect.currency;
            case UIAmountInputDecimalAspect.Precision:
            default:
                return UIConstants.decimalAspect.precision;
        }
    }, [decimalAspect]);

    const applyAmountMask = useAmountMaskApplyer(numberOfDecimalDigits);

    const formatText = useWorkletCallback((text: string) => {
        'worklet';

        return applyAmountMask(
            text,
            platformOS.value === 'ios' && multilineAnimated.value
                ? prevCaretPosition
                : selectionEndPosition,
        );
    });

    return formatText;
}
