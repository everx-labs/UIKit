import type BigNumber from 'bignumber.js';
import type { SharedValue } from 'react-native-reanimated';
import type {
    UIMaterialTextViewChild,
    UIMaterialTextViewProps,
    UIMaterialTextViewRef,
} from '../UIMaterialTextView/types';
import type { UIAmountInputDecimalAspect, UIAmountInputMessageType } from './constants';

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
    /**
     * Precision of the input value
     * @default "Precise"
     */
    precision: UIAmountInputPrecision;
};

export type UIAmountInputPrecision =
    | 'Integer' // integer number (aspectRatio === 0)
    | 'Precise' // precise numer (aspectRatio === 9)
    | 'Currency'; // currency number (aspectRatio === 2)

export type UIAmountInputRef = Omit<UIMaterialTextViewRef, 'changeText'> & {
    changeAmount: (amount: BigNumber | undefined, callOnChangeProp?: boolean) => void;
};

export type UIAmountInputChild = UIMaterialTextViewChild;

export type AmountInputContextDefaultValuesType = {
    isHovered: boolean;
    isFocused: boolean;
    inputText: string;
    normalizedText: string;
    formattedText: string;
    carretEndPosition: number;
};

export type AmountInputContextType = {
    [key in keyof AmountInputContextDefaultValuesType]: SharedValue<
        AmountInputContextDefaultValuesType[key]
    >;
};
