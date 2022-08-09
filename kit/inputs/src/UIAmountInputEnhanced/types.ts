import type BigNumber from 'bignumber.js';
import type { SharedValue } from 'react-native-reanimated';
import type { InputMessageType } from '../InputMessage';
import type {
    UIMaterialTextViewChild,
    UIMaterialTextViewProps,
    UIMaterialTextViewRef,
} from '../UIMaterialTextView/types';
import type { UIAmountInputEnhancedDecimalAspect } from './constants';

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
     * @default  InputMessageType.Info
     */
    messageType?: InputMessageType;
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
    /**
     * Precision of the input value
     * @default "Precise"
     */
    precision: UIAmountInputEnhancedPrecision;
};

export type UIAmountInputEnhancedPrecision =
    | 'Integer' // integer number (aspectRatio === 0)
    | 'Precise' // precise numer (aspectRatio === 9)
    | 'Currency'; // currency number (aspectRatio === 2)

export type UIAmountInputEnhancedRef = Omit<UIMaterialTextViewRef, 'changeText'> & {
    changeAmount: (amount: BigNumber | undefined, callOnChangeProp?: boolean) => void;
};

export type UIAmountInputEnhancedChild = UIMaterialTextViewChild;

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
