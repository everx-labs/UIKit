import type React from 'react';
import type { View, TextInput } from 'react-native';
import type { UITextViewProps } from '../UITextView';
import type { OnHeightChange } from '../useAutogrowTextView';

export type UIMaterialTextViewMask = '[000] [000].[000] [000]';

export type UIMaterialTextViewProps = UITextViewProps & {
    label?: string;
    helperText?: string;
    error?: boolean;
    warning?: boolean;
    success?: boolean;
    onLayout?: Pick<UITextViewProps, 'onLayout'>;
    borderViewRef?: React.Ref<View>;
    children?: React.ReactNode;
    onHeightChange?: OnHeightChange;
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
