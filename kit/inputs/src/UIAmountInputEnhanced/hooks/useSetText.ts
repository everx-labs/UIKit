import * as React from 'react';
import BigNumber from 'bignumber.js';
import { runOnJS, useAnimatedRef, useWorkletCallback } from 'react-native-reanimated';
import type { UITextViewRef } from '../../UITextView/types';
import { AmountInputContext } from '../constants';
import { setTextAndCaretPosition } from '../setTextAndCaretPosition';
import type { FormatAndSetTextConfig, UIAmountInputEnhancedProps } from '../types';

const defaultConfig: FormatAndSetTextConfig = {
    shouldSetText: true,
    shouldSetTheSameText: true,
    callOnChangeProp: true,
};
export function useSetText(
    ref: React.RefObject<UITextViewRef>,
    onChangeAmountProp: UIAmountInputEnhancedProps['onChangeAmount'],
) {
    // @ts-expect-error
    const inputManagerRef = useAnimatedRef<InputController | undefined>();

    const { formattedText, selectionEndPosition, normalizedText } =
        React.useContext(AmountInputContext);

    const onChangeNormalizedText = React.useCallback(
        (normalizedNumber: string) => {
            const value = normalizedNumber ? new BigNumber(normalizedNumber) : undefined;
            onChangeAmountProp(value);
        },
        [onChangeAmountProp],
    );

    const setText = useWorkletCallback(
        (
            textAttributes: {
                formattedText: string;
                normalizedText: string;
                caretPosition: number;
            },
            config: FormatAndSetTextConfig = defaultConfig,
        ): void => {
            'worklet';

            const {
                formattedText: newFormattedText,
                normalizedText: newNormalizedText,
                caretPosition: newCaretPosition,
            } = textAttributes;

            if (newFormattedText === formattedText.value) {
                return;
            }

            const {
                shouldSetTheSameText = defaultConfig.shouldSetTheSameText,
                callOnChangeProp = defaultConfig.callOnChangeProp,
                shouldSetText = defaultConfig.shouldSetText,
            } = config;

            formattedText.value = newFormattedText;
            selectionEndPosition.value = newCaretPosition;
            normalizedText.value = newNormalizedText;

            if (
                shouldSetText &&
                (formattedText.value !== newFormattedText || shouldSetTheSameText)
            ) {
                setTextAndCaretPosition(ref, inputManagerRef, newFormattedText, newCaretPosition);
            }

            if (callOnChangeProp) {
                runOnJS(onChangeNormalizedText)(newNormalizedText);
            }
        },
    );

    return setText;
}
