import type React from 'react';
import type { View, TextInput } from 'react-native';
import type { UIImageProps } from '@tonlabs/uikit.media';
import type { UITextViewProps } from '../UITextView';
import type { OnHeightChange } from '../useAutogrowTextView';

export type UIMaterialTextViewMask = '[000] [000].[000] [000]';

export type UIMaterialTextViewIconChild = React.ReactElement<UIMaterialTextViewIconProps>;
export type UIMaterialTextViewActionChild = React.ReactElement<UIMaterialTextViewActionProps>;
export type UIMaterialTextViewTextChild = React.ReactElement<UIMaterialTextViewTextProps>;
export type UIMaterialTextViewChild =
    | UIMaterialTextViewIconChild
    | UIMaterialTextViewActionChild
    | UIMaterialTextViewTextChild;

export type UIMaterialTextViewProps = UITextViewProps & {
    /**
     * Label of the UIMaterialTextView
     */
    label?: string;
    /**
     * Text providing validation information
     */
    helperText?: string;
    /**
     * Is validation error?
     * Defines the helperText style.
     */
    error?: boolean;
    /**
     * Is validation warning?
     * Defines the helperText style.
     */
    warning?: boolean;
    /**
     * Is validation success?
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
     * Provides a input mask
     */
    mask?: UIMaterialTextViewMask;
};

export type UIMaterialTextViewLayoutProps = UIMaterialTextViewProps & {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    isHovered: boolean;
    isFocused: boolean;
    inputHasValue: boolean;
};

export interface UIMaterialTextViewRef extends TextInput {
    changeText: (text: string, callOnChangeProp?: boolean) => void;
    moveCarret: (carretPosition: number, maxPosition?: number | undefined) => void;
}

export type ChangeText = (text: string, callOnChangeProp?: boolean | undefined) => void;
export type MoveCarret = (carretPosition: number, maxPosition?: number | undefined) => void;

export type UIMaterialTextViewIconProps = UIImageProps & {
    onPress?: () => void;
};

export type UIMaterialTextViewActionProps = {
    children: string;
    onPress?: () => void;
};

export type UIMaterialTextViewTextProps = { children: string };
