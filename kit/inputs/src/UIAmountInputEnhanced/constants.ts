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
    inputText: '',
    normalizedText: '',
    formattedText: '',
    carretEndPosition: 0,
};

export const defaultContext: AmountInputContextType = {
    isHovered: makeMutable(defaultContextValue.isHovered),
    isFocused: makeMutable(defaultContextValue.isFocused),
    inputText: makeMutable(defaultContextValue.inputText),
    normalizedText: makeMutable(defaultContextValue.normalizedText),
    formattedText: makeMutable(defaultContextValue.formattedText),
    carretEndPosition: makeMutable(defaultContextValue.carretEndPosition),
};

export const AmountInputContext = React.createContext<AmountInputContextType>(defaultContext);

export const UIConstants = {
    decimalAspect: {
        integer: 0,
        currency: 2,
        precision: 9,
    },
};
