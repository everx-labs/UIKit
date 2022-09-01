import * as React from 'react';
import { Platform } from 'react-native';
import BigNumber from 'bignumber.js';
import { runOnJS, SharedValue, useAnimatedRef, useWorkletCallback } from 'react-native-reanimated';
import type { UITextViewRef } from '../../UITextView/types';
import { AmountInputContext, UIAmountInputEnhancedDecimalAspect, UIConstants } from '../constants';
import { setTextAndCaretPosition } from '../setTextAndCaretPosition';
import type { FormatAndSetTextConfig, UIAmountInputEnhancedProps } from '../types';
import { useAmountMaskApplyer } from './amountMask';
import { useDerivedReactValue } from './hooks';

const defaultConfig: FormatAndSetTextConfig = {
    shouldSetTheSameText: true,
    callOnChangeProp: true,
};
export function useFormatAndSetText(
    ref: React.RefObject<UITextViewRef>,
    decimalAspect: UIAmountInputEnhancedProps['decimalAspect'],
    multiline: UIAmountInputEnhancedProps['multiline'],
    prevCaretPosition: SharedValue<number>,
    onChangeAmountProp: UIAmountInputEnhancedProps['onChangeAmount'],
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

    const onChangeNormalizedText = React.useCallback(
        (normalizedNumber: string) => {
            if (onChangeAmountProp) {
                const value = new BigNumber(normalizedNumber);
                onChangeAmountProp(value);
            }
        },
        [onChangeAmountProp],
    );

    const formatAndSetText = useWorkletCallback(
        (text: string, config: FormatAndSetTextConfig = defaultConfig): void => {
            'worklet';

            const { shouldSetTheSameText = true, callOnChangeProp = true } = config;
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

            if (text !== newFormattedText || shouldSetTheSameText) {
                setTextAndCaretPosition(ref, inputManagerRef, newFormattedText, newCaretPosition);
            }

            if (callOnChangeProp) {
                runOnJS(onChangeNormalizedText)(newNormalizedText);
            }

            formattedText.value = newFormattedText;
            selectionEndPosition.value = newCaretPosition;
            normalizedText.value = newNormalizedText;
        },
    );

    return formatAndSetText;
}
