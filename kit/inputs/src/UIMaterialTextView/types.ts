import type { View, TextInput } from 'react-native';
import type { UITextViewProps } from '../UITextView';
import type { OnHeightChange } from '../useAutogrowTextView';

export type UIMaterialTextViewCommonProps = UITextViewProps & {
    label: string;
    helperText?: string;
    error?: boolean;
    success?: boolean;
    onLayout?: Pick<UITextViewProps, 'onLayout'>;
    borderViewRef?: React.Ref<View>;
    children?: React.ReactNode;
    onHeightChange?: OnHeightChange;
};

export type UIMaterialTextViewProps = UIMaterialTextViewCommonProps & {
    /**
     * Whether to make label float or use default native placeholder
     */
    floating?: boolean;
};

export type UIMaterialTextViewRef = TextInput & {
    changeText: (text: string, callOnChangeProp?: boolean) => void;
};
