import type {
    FlexStyle,
    NativeSyntheticEvent,
    StyleProp,
    TextInput,
    TextInputChangeEventData,
    TextInputContentSizeChangeEventData,
    TextInputProps,
    TextStyle,
    ViewStyle,
} from 'react-native';
import type { ColorVariants } from '@tonlabs/uikit.themes';

/**
 * Only those `behavioral` styles from Text are accepted!
 */
type UITextViewStyle = Pick<
    TextStyle,
    | 'textAlign'
    | 'textAlignVertical'
    | 'textDecorationLine'
    | 'textDecorationStyle' // TODO: think if should expose it
    | 'textDecorationColor' // TODO: think if should expose it
    | 'textShadowColor' // TODO: think if should expose it
    | 'textShadowOffset'
    | 'textShadowRadius'
    | 'textTransform'
    | 'fontVariant'
    | 'writingDirection'
    | 'includeFontPadding'
> &
    Pick<ViewStyle, 'backfaceVisibility' | 'opacity' | 'elevation'> &
    FlexStyle;

export type UITextViewProps = Omit<
    TextInputProps,
    'style' | 'placeholderTextColor' | 'underlineColorAndroid' | 'numberOfLines'
> & {
    /**
     * Color of the placeholder
     */
    placeholderTextColor?: ColorVariants;
    style?: StyleProp<UITextViewStyle>;
    /**
     * Android only
     * A flag to apply EditorInfo.IME_FLAG_NO_PERSONALIZED_LEARNING
     * to inner EditText view
     */
    noPersonalizedLearning?: boolean;
    /**
     * A callback that is called when the input height changes
     */
    onHeightChange?: (height: number) => void;
    /**
     * TODO
     */
    maxNumberOfLines?: number;
};

export type UITextViewRef = Pick<
    TextInput,
    'isFocused' | 'focus' | 'blur' | 'clear' | 'setNativeProps'
> & {
    remeasureInputHeight: () => void;
};

export type AutogrowAttributes = {
    onContentSizeChange:
        | ((e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void)
        | undefined;
    onChange: ((event: NativeSyntheticEvent<TextInputChangeEventData>) => void) | undefined;
    remeasureInputHeight: (() => void) | undefined;
    numberOfLines: number | undefined;
    autogrowStyle: StyleProp<TextStyle> | undefined;
};
