import type {
    FlexStyle,
    NativeSyntheticEvent,
    StyleProp,
    TextInput,
    TextInputChangeEventData,
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
     * A callback that is called when the input height changes.
     * Only works with `multiline={true}`
     */
    onHeightChange?: (height: number) => void;
    /**
     * The maximum number of visible lines of text.
     * A further increase in the text will lead to the appearance of a scroll in the component.
     * Only works with `multiline={true}`
     */
    maxNumberOfLines?: number;
    /**
     * A callback that is called when the input number of lines changes.
     * Only works with `multiline={true}`
     */
    onNumberOfLinesChange?: (numberOfLines: number) => void;
};

export interface UITextViewRef
    extends Pick<TextInput, 'isFocused' | 'focus' | 'blur' | 'clear' | 'setNativeProps'> {
    remeasureInputHeight: () => void;
}

export type AutogrowAttributes = {
    onChange: ((event: NativeSyntheticEvent<TextInputChangeEventData>) => void) | undefined;
    remeasureInputHeight: (() => void) | undefined;
    numberOfLines: number | undefined;
    autogrowStyle: StyleProp<TextStyle> | undefined;
};
