import type BigNumber from 'bignumber.js';
import type { UIMaterialTextViewRef } from '../UIMaterialTextView/types';
import type { UIAmountInputDecimalAspect, UIAmountInputMessageType } from './constants';

export type UIAmountInputProps = {
    /**
     * A callback that is called after changing the value in the input by the user.
     */
    onChangeAmount: (amount: BigNumber | undefined) => void;
    /**
     * The default value that is displayed in the input.
     */
    defaultAmount?: BigNumber;
    /**
     * Label of the input.
     */
    label?: string;
    /**
     * How many digits to draw for decimal aspect.
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
     * The string that will be rendered before text input has been entered.
     */
    placeholder?: string;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type UIAmountInputRef = Omit<UIMaterialTextViewRef, 'changeText'> & {
    changeAmount: (amount: BigNumber | undefined, callOnChangeProp?: boolean) => void;
};
