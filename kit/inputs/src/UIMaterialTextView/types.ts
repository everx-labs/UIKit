import type {
    View,
    TextInput,
    NativeSyntheticEvent,
    TextInputContentSizeChangeEventData,
    TextInputChangeEventData,
} from 'react-native';
import type { UITextViewProps } from '../UITextView';
import type { OnHeightChange } from '../useAutogrowTextView';

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
};

export type UIMaterialTextViewRef = TextInput & {
    changeText: (text: string, callOnChangeProp?: boolean) => void;
};

export type AutogrowAttributes = {
    onContentSizeChange:
        | ((e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void)
        | undefined;
    onChange: ((event: NativeSyntheticEvent<TextInputChangeEventData>) => void) | undefined;
    resetInputHeight: () => void;
    numberOfLines: number | undefined;
};
