import type BigNumber from 'bignumber.js';
import type { TextInput } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { UIMaterialTextViewProps } from '../UIMaterialTextView/types';
import type { InputChildren } from '../useInputChildren';

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

export type UIAmountInputProps = Omit<
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
     * @default  UIAmountInputDecimalAspect.Precision
     */
    decimalAspect?: UIAmountInputDecimalAspect;
    /**
     * Type of the message. Affects the style of the message.
     * @default  UIAmountInputMessageType.Info
     */
    messageType?: UIAmountInputMessageType;
    /**
     * Message text.
     */
    message?: string;
    /**
     *  As children you can provide only one or two of this component:
     *  `UIAmountInput.Icon`
     *  `UIAmountInput.Action`
     *  `UIAmountInput.Text`
     */
    children?: UIAmountInputChild | UIAmountInputChild[] | undefined;
};

export type UIAmountInputPrecision =
    | 'Integer' // integer number (aspectRatio === 0)
    | 'Precise' // precise numer (total digit count (integer and decimal) is less than 15)
    | 'Currency'; // currency number (aspectRatio === 2)

export type UIAmountInputRef = Pick<TextInput, 'isFocused' | 'focus' | 'blur' | 'clear'> & {
    changeAmount: (amount: BigNumber | undefined, callOnChangeProp?: boolean) => void;
};

export type UIAmountInputChild = InputChildren;

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
