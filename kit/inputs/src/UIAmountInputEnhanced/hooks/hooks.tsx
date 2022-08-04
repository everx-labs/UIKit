import * as React from 'react';
import BigNumber from 'bignumber.js';
import { uiLocalized } from '@tonlabs/localization';
import { DerivedValue, useSharedValue } from 'react-native-reanimated';
import type { UIMaterialTextViewRef, UIMaterialTextViewMask } from '../../UIMaterialTextView';
import { UIAmountInputEnhancedDecimalAspect, UIAmountInputEnhancedMessageType } from '../constants';
import type { UIAmountInputEnhancedProps, UIAmountInputEnhancedRef } from '../types';
import {
    getEmptyUIMaterialTextViewRef,
    useMaterialTextViewChildren,
    MaterialTextViewClearButton,
} from '../../MaterialTextView';

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
                    `[UIAmountInputEnhanced] useOnChangeText: an incorrect character was entered. Input changes were prevented`,
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

export function useHelperTextStatus(messageType: UIAmountInputEnhancedMessageType | undefined) {
    return React.useMemo(() => {
        switch (messageType) {
            case UIAmountInputEnhancedMessageType.Error:
                return {
                    error: true,
                    warning: false,
                    success: false,
                };
            case UIAmountInputEnhancedMessageType.Warning:
                return {
                    error: false,
                    warning: true,
                    success: false,
                };
            case UIAmountInputEnhancedMessageType.Success:
                return {
                    error: false,
                    warning: false,
                    success: true,
                };
            case UIAmountInputEnhancedMessageType.Info:
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
    decimalAspect: UIAmountInputEnhancedDecimalAspect | undefined,
): UIMaterialTextViewMask {
    return React.useMemo((): UIMaterialTextViewMask => {
        switch (decimalAspect) {
            case UIAmountInputEnhancedDecimalAspect.Integer:
                return 'AmountInteger';
            case UIAmountInputEnhancedDecimalAspect.Currency:
                return 'AmountCurrency';
            case UIAmountInputEnhancedDecimalAspect.Precision:
            default:
                return 'AmountPrecision';
        }
    }, [decimalAspect]);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { changeText, ...defaultRef } = getEmptyUIMaterialTextViewRef(
    'UIAmountInputEnhanced/hooks.ts',
);

export function useExtendedRef(
    forwardedRed: React.Ref<UIAmountInputEnhancedRef>,
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

    React.useImperativeHandle<Record<string, any>, UIAmountInputEnhancedRef>(
        forwardedRed,
        (): UIAmountInputEnhancedRef => ({
            ...defaultRef,
            ...localRef.current,
            changeAmount,
        }),
    );
}

export function useUIAmountInputEnhancedChildren(
    children: UIAmountInputEnhancedProps['children'],
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    clear: (() => void) | undefined,
): UIAmountInputEnhancedProps['children'] {
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
