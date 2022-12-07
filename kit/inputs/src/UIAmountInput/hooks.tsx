import * as React from 'react';
import BigNumber from 'bignumber.js';
import { uiLocalized } from '@tonlabs/localization';
import type { UIMaterialTextViewRef, UIMaterialTextViewMask } from '../UIMaterialTextView';
import { UIAmountInputDecimalAspect, UIAmountInputMessageType } from './constants';
import type { UIAmountInputProps, UIAmountInputRef } from './types';
import {
    getEmptyUIMaterialTextViewRef,
    useMaterialTextViewChildren,
    MaterialTextViewClearButton,
} from '../MaterialTextView';

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
    checkInputHasValue: (text: string) => string,
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
            checkInputHasValue(text);
            onChangeAmount(amount);
            previousTextRef.current = text;
        },
        [checkInputHasValue, onChangeAmount, ref],
    );
}

export function useHelperTextStatus(messageType: UIAmountInputMessageType | undefined) {
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
            // .toString() always returns string with '.' separator
            // and doesn't count current system locale
            // so u'll get errors in locale with ',' separator
            const text = amount ? uiLocalized.amountToLocale(amount) : '';
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
    hideClearButton: UIAmountInputProps['hideClearButton'],
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    editable: boolean,
    clear: (() => void) | undefined,
): UIAmountInputProps['children'] {
    const materialTextViewChildren = useMaterialTextViewChildren(children);

    if (materialTextViewChildren && materialTextViewChildren.length > 0) {
        /**
         * We don't show the ClearButton when we show any children
         */
        return materialTextViewChildren;
    }

    if (hideClearButton) {
        /**
         * We don't need to reserve the place for the ClearButton
         * because it can't appear if hideClearButton provided.
         */
        return undefined;
    }

    if (editable && inputHasValue && (isFocused || isHovered)) {
        /**
         * Show the ClearButton only if no other children, some text is shown
         * and the Input is editable and focused or hovered.
         */
        return <MaterialTextViewClearButton clear={clear} />;
    }

    /**
     * Reserve space for the ClearButton because it may appear.
     */
    return <MaterialTextViewClearButton hiddenButton />;
}
