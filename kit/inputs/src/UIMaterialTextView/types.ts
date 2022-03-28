import type React from 'react';
import type {
    View,
    TextInput,
    NativeSyntheticEvent,
    TextInputContentSizeChangeEventData,
    TextInputChangeEventData,
} from 'react-native';
import type { UIImageProps } from '@tonlabs/uikit.media';
import type { UITextViewProps } from '../UITextView';

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
    onHeightChange?: (height: number) => void;
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
    /**
     * Callback called by clicking/tapping on the icon
     */
    onPress?: () => void;
};

export type UIMaterialTextViewActionProps = UIMaterialTextViewTextProps & {
    /**
     * Callback called by clicking/tapping on the action
     */
    onPress?: () => void;
};

export type UIMaterialTextViewTextProps = {
    /**
     * You can pass a `string`, `UIImage`, or any other element as children.
     *
     * If it is a `string`, it will be placed in a `UILabel` with suitable styles.
     *
     * If it is the `UIImage`, a suitable `tintColor` prop and size styles will be passed to it.
     *
     * Any other element will be displayed unchanged.
     */
    children: React.ReactNode;
};

export type AutogrowAttributes = {
    onContentSizeChange:
        | ((e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void)
        | undefined;
    onChange: ((event: NativeSyntheticEvent<TextInputChangeEventData>) => void) | undefined;
    resetInputHeight: () => void;
    numberOfLines: number | undefined;
};
