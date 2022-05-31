import * as React from 'react';
import { makeMutable } from 'react-native-reanimated';
import type { AmountInputContextDefaultValuesType, AmountInputContextType } from './types';

export enum UIAmountInputMessageType {
    Error = 'Error',
    Warning = 'Warning',
    Success = 'Success',
    Info = 'Info',
}

export enum UIAmountInputDecimalAspect {
    Integer = 'Integer',
    Currency = 'Currency',
    Precision = 'Precision',
}

export const defaultContextValue: AmountInputContextDefaultValuesType = {
    isHovered: false,
    isFocused: false,
    inputText: '',
    formattedText: '',
    carretEndPosition: 0,
};

export const defaultContext: AmountInputContextType = {
    isHovered: makeMutable(defaultContextValue.isHovered),
    isFocused: makeMutable(defaultContextValue.isFocused),
    inputText: makeMutable(defaultContextValue.inputText),
    formattedText: makeMutable(defaultContextValue.formattedText),
    carretEndPosition: makeMutable(defaultContextValue.carretEndPosition),
};

export const AmountInputContext = React.createContext<AmountInputContextType>(defaultContext);
