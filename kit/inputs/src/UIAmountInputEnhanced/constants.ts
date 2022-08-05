import * as React from 'react';
import { makeMutable } from 'react-native-reanimated';
import type { AmountInputContextDefaultValuesType, AmountInputContextType } from './types';

export enum UIAmountInputEnhancedMessageType {
    Error = 'Error',
    Warning = 'Warning',
    Success = 'Success',
    Info = 'Info',
}

export enum UIAmountInputEnhancedDecimalAspect {
    Integer = 'Integer',
    Currency = 'Currency',
    Precision = 'Precision',
}

export const defaultContextValue: AmountInputContextDefaultValuesType = {
    isHovered: false,
    isFocused: false,
    normalizedText: '',
    formattedText: '',
    selectionEndPosition: 0,
};

export function getDefaultContext() {
    return {
        isHovered: makeMutable(defaultContextValue.isHovered),
        isFocused: makeMutable(defaultContextValue.isFocused),
        normalizedText: makeMutable(defaultContextValue.normalizedText),
        formattedText: makeMutable(defaultContextValue.formattedText),
        selectionEndPosition: makeMutable(defaultContextValue.selectionEndPosition),
    };
}

export const AmountInputContext = React.createContext<AmountInputContextType>(getDefaultContext());

export const UIConstants = {
    decimalAspect: {
        integer: 0,
        currency: 2,
        precision: 9,
    },
};
