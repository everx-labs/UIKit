import * as React from 'react';
import BigNumber from 'bignumber.js';
import { uiLocalized } from '@tonlabs/localization';
import {
    UIMaterialTextView,
    UIMaterialTextViewRef,
    UIMaterialTextViewMask,
} from '../UIMaterialTextView';
import type { UIAmountInputProps } from './types';
import { UIAmountInputDecimalAspect, UIAmountInputMessageType } from './constants';

const notDigitOrDelimiterRegExp = new RegExp(
    `[^\\d\\${uiLocalized.localeInfo.numbers.decimal}]`,
    'g',
);
const delimiterRegExp = new RegExp(`[\\${uiLocalized.localeInfo.numbers.decimal}]`, 'g');
const delimiterForBigNumber = '.';

function convertTextToBigNumber(text: string): BigNumber | undefined {
    const normalizedText = text.replace(notDigitOrDelimiterRegExp, '');
    const normalizedTextWithAccurateDelimiter =
        uiLocalized.localeInfo.numbers.decimal !== delimiterForBigNumber
            ? normalizedText.replace(delimiterRegExp, delimiterForBigNumber)
            : normalizedText;
    if (
        !normalizedTextWithAccurateDelimiter ||
        normalizedTextWithAccurateDelimiter === delimiterForBigNumber
    ) {
        return undefined;
    }
    return new BigNumber(normalizedTextWithAccurateDelimiter);
}

function useOnChangeText(
    onChangeAmount: (amount: BigNumber | undefined) => void,
    ref: React.RefObject<UIMaterialTextViewRef>,
) {
    const previousTextRef = React.useRef<string>('');
    return React.useCallback(
        (text: string): void => {
            const amount = convertTextToBigNumber(text);
            if (amount?.isNaN()) {
                console.error(
                    `[UIAmountInput] useOnChangeText: an incorrect character was entered. Input changes were prevented`,
                );
                ref.current?.changeText(previousTextRef.current, false);
                return;
            }
            onChangeAmount(amount);
            previousTextRef.current = text;
        },
        [onChangeAmount, ref],
    );
}

function useHelperTextStatus(messageType: UIAmountInputMessageType | undefined) {
    return React.useMemo(() => {
        switch (messageType) {
            case UIAmountInputMessageType.Error:
                return {
                    error: true,
                    warning: false,
                    success: false,
                };
            case UIAmountInputMessageType.Warning:
                return {
                    error: false,
                    warning: true,
                    success: false,
                };
            case UIAmountInputMessageType.Success:
                return {
                    error: false,
                    warning: false,
                    success: true,
                };
            case UIAmountInputMessageType.Info:
            default:
                return {
                    error: false,
                    warning: false,
                    success: false,
                };
        }
    }, [messageType]);
}

function useMask(decimalAspect: UIAmountInputDecimalAspect | undefined): UIMaterialTextViewMask {
    return React.useMemo((): UIMaterialTextViewMask => {
        switch (decimalAspect) {
            case UIAmountInputDecimalAspect.Integer:
                return 'AmountInteger';
            case UIAmountInputDecimalAspect.Currency:
                return 'AmountCurrency';
            case UIAmountInputDecimalAspect.Precision:
            default:
                return 'AmountPrecision';
        }
    }, [decimalAspect]);
}

export function UIAmountInput(props: UIAmountInputProps) {
    const { onChangeAmount, defaultAmount, decimalAspect, messageType, message, ...restProps } =
        props;

    const ref = React.useRef<UIMaterialTextViewRef>(null);

    const onChangeText = useOnChangeText(onChangeAmount, ref);

    const mask: UIMaterialTextViewMask = useMask(decimalAspect);

    const defaultValue = React.useMemo(() => {
        return defaultAmount?.toString();
    }, [defaultAmount]);

    const { error, warning, success } = useHelperTextStatus(messageType);

    return (
        <UIMaterialTextView
            {...restProps}
            ref={ref}
            defaultValue={defaultValue}
            helperText={message}
            error={error}
            warning={warning}
            success={success}
            mask={mask}
            onChangeText={onChangeText}
            keyboardType="decimal-pad"
        />
    );
}
