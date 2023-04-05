import type React from 'react';
import type { View, TextInput } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { UITextViewProps } from '../UITextView';
import type { InputColorScheme } from '../Common';

export type MaterialTextViewAmountMask =
    | 'AmountInteger' // integer number (aspectRatio === 0)
    | 'AmountPrecision' // precision numer (aspectRatio === 9)
    | 'AmountCurrency'; // currency number (aspectRatio === 2)
export type MaterialTextViewMask = MaterialTextViewAmountMask;

export type MaterialTextViewProps = Omit<UITextViewProps, 'style'> & {
    /**
     * Label of the MaterialTextView.
     * Note: If the value was passed during the first render, then it cannot be removed during next
     * re-renders, the component will behave incorrectly.
     * Note2: If the value was not passed during the first render, then it cannot be passed during
     * next re-renders, the component will behave incorrectly.
     */
    label?: string;
    /**
     * Text providing validation information
     */
    helperText?: string;
    /**
     * Callback called by clicking/tapping on the helperText
     */
    onHelperTextPress?: () => void;
    /**
     * Validation error
     * Defines the helperText style.
     */
    error?: boolean;
    /**
     * Validation warning
     * Defines the helperText style.
     */
    warning?: boolean;
    /**
     * Validation success
     * Defines the helperText style.
     */
    success?: boolean;
    /**
     * This is usefull for measure MaterialTextView position
     */
    borderViewRef?: React.Ref<View>;
    /**
     * This component will be rendered inside the MaterialTextView in front of inputed text.
     */
    children?: React.ReactNode;
    /**
     * Provides a input mask.
     * It must not be changed between renders.
     */
    mask?: MaterialTextViewMask;
    /**
     * A callback that is called when the cursor is over the input.
     */
    onHover?: (isHovered: boolean) => void;
    /**
     * Color scheme of the TextView.
     * @default InputColorScheme.Default
     */
    colorScheme?: InputColorScheme;
};

export type MaterialTextViewLayoutProps = MaterialTextViewProps & {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    isHovered: boolean;
    isFocused: SharedValue<boolean>;
    hasValue: SharedValue<boolean>;
};

export type MaterialTextViewRef = Pick<TextInput, 'isFocused' | 'focus' | 'blur' | 'clear'> & {
    changeText: MaterialTextViewRefChangeText;
    moveCarret: MaterialTextViewRefMoveCarret;
};

export type MaterialTextViewRefChangeText = (text: string, callOnChangeProp?: boolean) => void;
export type MaterialTextViewRefMoveCarret = (carretPosition: number, maxPosition?: number) => void;

export type ImperativeChangeTextConfig = {
    callOnChangeProp?: boolean;
    shouldSetNativeProps?: boolean;
};
export type ImperativeChangeText = (text: string, config?: ImperativeChangeTextConfig) => void;

export type MaterialTextViewInputState = {
    formattedText: string;
    carretPosition: number | null;
};
export type MaterialTextViewApplyMask = (text: string) => MaterialTextViewInputState;
