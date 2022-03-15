import type React from 'react';
import type { View, TextInput } from 'react-native';
import type { UIImageProps } from '@tonlabs/uikit.media';
import type { UITextViewProps } from '../UITextView';
import type { OnHeightChange } from '../useAutogrowTextView';

export type UIMaterialTextViewMask = 'Amount';

export type UIMaterialTextViewIconChild = React.ReactElement<UIMaterialTextViewIconProps>;
export type UIMaterialTextViewActionChild = React.ReactElement<UIMaterialTextViewActionProps>;
export type UIMaterialTextViewTextChild = React.ReactElement<UIMaterialTextViewTextProps>;
export type UIMaterialTextViewChild =
    | UIMaterialTextViewIconChild
    | UIMaterialTextViewActionChild
    | UIMaterialTextViewTextChild;

export type UIMaterialTextViewProps = Omit<UITextViewProps, 'style'> & {
    /**
     * Label of the UIMaterialTextView
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
     * This is usefull for measure UIMaterialTextView position
     */
    borderViewRef?: React.Ref<View>;
    /**
     *  As children you can provide only one or two of this component:
     *  `UIMaterialTextViewIcon`
     *  `UIMaterialTextViewAction`
     *  `UIMaterialTextViewText`
     */
    children?: UIMaterialTextViewChild | UIMaterialTextViewChild[] | undefined;
    /**
     * A callback that is called when the input height changes
     */
    onHeightChange?: OnHeightChange;
    /**
     * Provides a input mask.
     * It must not be changed between renders.
     */
    mask?: UIMaterialTextViewMask;
};

export type UIMaterialTextViewLayoutProps = UIMaterialTextViewProps & {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    isHovered: boolean;
    isFocused: boolean;
    inputHasValue: boolean;
    style?: UITextViewProps['style'];
};

export interface UIMaterialTextViewRef extends TextInput {
    changeText: (text: string, callOnChangeProp?: boolean) => void;
    moveCarret: (carretPosition: number, maxPosition?: number | undefined) => void;
}

export type ChangeText = (text: string, callOnChangeProp?: boolean | undefined) => void;
export type MoveCarret = (carretPosition: number, maxPosition?: number | undefined) => void;

export type ImperativeChangeTextConfig = {
    callOnChangeProp?: boolean;
    shouldSetNativeProps?: boolean;
};
export type ImperativeChangeText = (text: string, config?: ImperativeChangeTextConfig) => void;

export type UIMaterialTextViewIconProps = UIImageProps & {
    onPress?: () => void;
};

export type UIMaterialTextViewActionProps = {
    children: string;
    onPress?: () => void;
};

export type UIMaterialTextViewTextProps = { children: string };
