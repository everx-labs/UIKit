import type React from 'react';
import type { View, ViewStyle, StyleProp, TextInput } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { UIImageProps } from '@tonlabs/uikit.media';

import type { UITextViewProps } from '../UITextView';

export type MaterialTextViewAmountMask =
    | 'AmountInteger' // integer number (aspectRatio === 0)
    | 'AmountPrecision' // precision numer (aspectRatio === 9)
    | 'AmountCurrency'; // currency number (aspectRatio === 2)
export type MaterialTextViewMask = MaterialTextViewAmountMask;

export type MaterialTextViewIconChild = React.ReactElement<MaterialTextViewIconProps>;
export type MaterialTextViewActionChild = React.ReactElement<MaterialTextViewActionProps>;
export type MaterialTextViewTextChild = React.ReactElement<MaterialTextViewTextProps>;
export type MaterialTextViewChild =
    | MaterialTextViewIconChild
    | MaterialTextViewActionChild
    | MaterialTextViewTextChild;

export type MaterialTextViewProps = Omit<UITextViewProps, 'style'> & {
    /**
     * Label of the MaterialTextView
     */
    label?: string;
    /**
     * Text providing validation information
     */
    helperText?: string;
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
     *  As children you can provide only one or two of this component:
     *  `MaterialTextView.Icon`
     *  `MaterialTextView.Action`
     *  `MaterialTextView.Text`
     */
    children?: MaterialTextViewChild | MaterialTextViewChild[] | undefined;
    /**
     * Provides a input mask.
     * It must not be changed between renders.
     */
    mask?: MaterialTextViewMask;
    /**
     * A callback that is called when the cursor is over the input.
     */
    onHover?: (isHovered: boolean) => void;
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

export type MaterialTextViewIconProps = UIImageProps & {
    /**
     * Callback called by clicking/tapping on the icon
     */
    onPress?: () => void;
    /**
     * Style of icon container view
     */
    containerStyle?: StyleProp<ViewStyle>;
};

export type MaterialTextViewActionProps = MaterialTextViewTextProps & {
    /**
     * Callback called by clicking/tapping on the action
     */
    onPress?: () => void;
};

export type MaterialTextViewTextProps = {
    /**
     * You can pass a `string`, `Image`, or any other element as children.
     *
     * If it is a `string`, it will be placed in a `Label` with suitable styles.
     *
     * If it is the `Image`, a suitable `tintColor` prop and size styles will be passed to it.
     *
     * Any other element will be displayed unchanged.
     */
    children: React.ReactNode;
};

export type MaterialTextViewClearButtonProps = {
    clear?: (() => void) | undefined;
    hiddenButton?: boolean;
};

export type MaterialTextViewInputState = {
    formattedText: string;
    carretPosition: number | null;
};
export type MaterialTextViewApplyMask = (text: string) => MaterialTextViewInputState;
