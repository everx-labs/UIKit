import type BigNumber from 'bignumber.js';
import type { TextInput } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { ColorVariants } from '@tonlabs/uikit.themes';

import type { UIMaterialTextViewProps } from '../UIMaterialTextView/types';
import type { InputChildren } from '../InputChildren';

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
    'mask' | 'defaultValue' | 'value' | 'onChangeText' | 'colorScheme'
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
     * @web
     * Callback that calls when the message text was tapped.
     * Note: It works only for web.
     */
    onMessagePress?: () => void | undefined;
    /**
     *  As children you can provide only one or two of this component:
     *  `UIAmountInput.Icon`
     *  `UIAmountInput.Action`
     *  `UIAmountInput.Text`
     */
    children?: UIAmountInputChildren;
    /**
     * Color scheme of the TextView.
     * @default UIAmountInputColorScheme.Default
     */
    colorScheme?: UIAmountInputColorScheme;
    /**
     * Background colors of the AmountInput in regular and disabled (`editable={false}`) states.
     *
     * @default
     * ```ts
     *  {
     *      regular: ColorVariants.BackgroundBW,
     *      disabled: ColorVariants.BackgroundTertiary,
     *  }
     * ```
     */
    backgroundColors?: BackgroundColors;
};

export type UIAmountInputPrecision =
    | 'Integer' // integer number (aspectRatio === 0)
    | 'Precise' // precise numer (total digit count (integer and decimal) is less than 15)
    | 'Currency'; // currency number (aspectRatio === 2)

export type UIAmountInputRef = Pick<TextInput, 'isFocused' | 'focus' | 'blur' | 'clear'> & {
    changeAmount: (amount: BigNumber | undefined, callOnChangeProp?: boolean) => void;
};

export type UIAmountInputChildren = InputChildren;

export type AmountInputContextDefaultValuesType = {
    isHovered: boolean;
    isFocused: boolean;
    /**
     * String to convenient converting to BigNumber
     * e.g. '11111.1111'
     */
    normalizedText: string;
    /**
     * String for representation according to localization
     * e.g. '11 111,111 1'
     */
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

export type BackgroundColors = {
    /**
     * Background color of the AmountInput in regular state.
     */
    regular: ColorVariants;
    /**
     * Background color of the AmountInput in disabled (`editable={false}`) state.
     */
    disabled: ColorVariants;
};

export enum UIAmountInputColorScheme {
    Default = 'Default',
    Secondary = 'Secondary',
}
