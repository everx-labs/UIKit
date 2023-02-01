import * as React from 'react';
import BigNumber from 'bignumber.js';
import { uiLocalized } from '@tonlabs/localization';
import { DerivedValue, useSharedValue } from 'react-native-reanimated';
import type { UIMaterialTextViewRef, UIMaterialTextViewMask } from '../../UIMaterialTextView';
import { UIAmountInputProps, UIAmountInputDecimalAspect, UIAmountInputRef } from '../types';
import {
    getEmptyUIMaterialTextViewRef,
    useMaterialTextViewChildren,
    MaterialTextViewClearButton,
} from '../../MaterialTextView';
import { InputMessageType } from '../../InputMessage';

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

export function useOnChangeText(
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

export function useHelperTextStatus(messageType: InputMessageType | undefined) {
    return React.useMemo(() => {
        switch (messageType) {
            case InputMessageType.Error:
                return {
                    error: true,
                    warning: false,
                    success: false,
                };
            case InputMessageType.Warning:
                return {
                    error: false,
                    warning: true,
                    success: false,
                };
            case InputMessageType.Success:
                return {
                    error: false,
                    warning: false,
                    success: true,
                };
            case InputMessageType.Info:
            default:
                return {
                    error: false,
                    warning: false,
                    success: false,
                };
        }
    }, [messageType]);
}

export function useMask(
    decimalAspect: UIAmountInputDecimalAspect | undefined,
): UIMaterialTextViewMask {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { changeText, ...defaultRef } = getEmptyUIMaterialTextViewRef('UIAmountInput/hooks.ts');

export function useExtendedRef(
    forwardedRed: React.Ref<UIAmountInputRef>,
    checkInputHasValue: (text: string) => string,
    localRef: React.RefObject<UIMaterialTextViewRef>,
) {
    const changeAmount = React.useCallback(
        function changeAmount(amount: BigNumber | undefined, callOnChangeProp?: boolean) {
            const text = amount ? amount.toString() : '';
            checkInputHasValue(text);
            localRef.current?.changeText(text, callOnChangeProp);
        },
        [checkInputHasValue, localRef],
    );

    React.useImperativeHandle<Record<string, any>, UIAmountInputRef>(
        forwardedRed,
        (): UIAmountInputRef => ({
            ...defaultRef,
            ...localRef.current,
            changeAmount,
        }),
    );
}

export function useUIAmountInputChildren(
    children: UIAmountInputProps['children'],
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    clear: (() => void) | undefined,
): UIAmountInputProps['children'] {
    const materialTextViewChildren = useMaterialTextViewChildren(children);

    if (materialTextViewChildren) {
        return materialTextViewChildren;
    }

    if (inputHasValue && (isFocused || isHovered)) {
        return <MaterialTextViewClearButton clear={clear} />;
    }

    return undefined;
}

export function useDerivedReactValue<T>(value: T): DerivedValue<T> {
    const valueAnimated = useSharedValue(value);
    React.useEffect(() => {
        if (valueAnimated.value !== value) {
            valueAnimated.value = value;
        }
    }, [valueAnimated, value]);
    return valueAnimated;
}
