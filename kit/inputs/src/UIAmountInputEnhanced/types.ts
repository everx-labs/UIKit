import type BigNumber from 'bignumber.js';
import type { TextInput } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { UIMaterialTextViewProps } from '../UIMaterialTextView/types';
import type { InputChildren } from '../useInputChildren';
import type { UIAmountInputEnhancedDecimalAspect } from './constants';

export enum UIAmountInputEnhancedMessageType {
    Error = 'Error',
    Warning = 'Warning',
    Success = 'Success',
    Info = 'Info',
}

export type UIAmountInputEnhancedProps = Omit<
    UIMaterialTextViewProps,
    'mask' | 'defaultValue' | 'value' | 'onChangeText'
> & {
    /**
     * A callback that is called after changing the value in the input by the user.
     */
    onChangeAmount: (amount: BigNumber | undefined) => void;
    /**
     * The default value that is displayed in the input.
     */
    defaultAmount?: BigNumber;
    /**
     * How many digits to draw for decimal part.
     *
     * You should choose from predefined ones.
     * @default  UIAmountInputEnhancedDecimalAspect.Precision
     */
    decimalAspect?: UIAmountInputEnhancedDecimalAspect;
    /**
     * Type of the message. Affects the style of the message.
     * @default  UIAmountInputEnhancedMessageType.Info
     */
    messageType?: UIAmountInputEnhancedMessageType;
    /**
     * Message text.
     */
    message?: string;
    /**
     *  As children you can provide only one or two of this component:
     *  `UIAmountInputEnhanced.Icon`
     *  `UIAmountInputEnhanced.Action`
     *  `UIAmountInputEnhanced.Text`
     */
    children?: UIAmountInputEnhancedChild | UIAmountInputEnhancedChild[] | undefined;
};

export type UIAmountInputEnhancedPrecision =
    | 'Integer' // integer number (aspectRatio === 0)
    | 'Precise' // precise numer (total digit count (integer and decimal) is less than 15)
    | 'Currency'; // currency number (aspectRatio === 2)

export type UIAmountInputEnhancedRef = Pick<TextInput, 'isFocused' | 'focus' | 'blur' | 'clear'> & {
    changeAmount: (amount: BigNumber | undefined, callOnChangeProp?: boolean) => void;
};

export type UIAmountInputEnhancedChild = InputChildren;

export type AmountInputContextDefaultValuesType = {
    isHovered: boolean;
    isFocused: boolean;
    normalizedText: string;
    formattedText: string;
    selectionEndPosition: number;
};

export type AmountInputContextType = {
    [key in keyof AmountInputContextDefaultValuesType]: SharedValue<
        AmountInputContextDefaultValuesType[key]
    >;
};

export type FormatAndSetTextConfig = {
    /**
     * @default true
     */
    shouldSetText?: boolean;
    /**
     * @default true
     */
    callOnChangeProp?: boolean;
};

export type TextAttributes = {
    formattedText: string;
    normalizedText: string;
    caretPosition: number;
};
export type FormatText = (text: string) => TextAttributes;
export type SetText = (textAttributes: TextAttributes, config: FormatAndSetTextConfig) => void;

export type ExpansionState = 'Expanded' | 'Collapsed' | 'InExpandProgress' | 'InCollapseProgress';
