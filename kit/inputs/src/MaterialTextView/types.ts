import type React from 'react';
import type { View, ViewStyle, StyleProp, TextInput } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { UIImageProps } from '@tonlabs/uikit.media';
import type { ColorVariants } from '@tonlabs/uikit.themes';

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

export type BackgroundColors = {
    /**
     * Background color of the TextView in regular state.
     */
    regular: ColorVariants;
    /**
     * Background color of the TextView in disabled (`editable={false}`) state.
     */
    disabled: ColorVariants;
};

export enum MaterialTextViewColorScheme {
    Default = 'Default',
    Secondary = 'Secondary',
}

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
    /**
     * Color scheme of the TextView.
     * @default MaterialTextViewColorScheme.Default
     */
    colorScheme?: MaterialTextViewColorScheme;
    /**
     * Background colors of the TextView in regular and disabled (`editable={false}`) states.
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
     * Overwrites the predefined container style.
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
     * You can pass a `string` or `UIImage`.
     *
     * If it is a `string`, it will be placed in a `UILabel` with suitable styles.
     *
     * If it is the `UIImage`, a suitable color and size styles will be passed to it.
     */
    children:
        | string
        | React.ReactElement<UIImageProps>
        | (string | React.ReactElement<UIImageProps>)[];
};

export type MaterialTextViewClearButtonProps = {
    /**
     * The callback that calls when the CleraButton was pressed
     */
    clear?: (() => void) | undefined;
    /**
     * Should the button to be just empty container with size of the visible button
     * to reserve space for the button.
     */
    hiddenButton?: boolean;
};

export type MaterialTextViewInputState = {
    formattedText: string;
    carretPosition: number | null;
};
export type MaterialTextViewApplyMask = (text: string) => MaterialTextViewInputState;

export type MaterialTextViewContextType = {
    /**
     * Color scheme of the TextView.
     * @default MaterialTextViewColorScheme.Default
     */
    colorScheme: MaterialTextViewColorScheme;
};
