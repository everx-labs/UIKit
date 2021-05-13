import * as React from 'react';
import {
    FlexStyle,
    TextInput,
    TextInputProps,
    TextStyle,
    ViewStyle,
    Platform,
    StyleSheet,
    StyleProp,
} from 'react-native';
import { ColorVariants, useTheme } from './Colors';
import { Typography, TypographyVariants } from './Typography';

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
    'style' | 'placeholderTextColor' | 'underlineColorAndroid'
> & {
    placeholderTextColor?: ColorVariants;
    style?: StyleProp<UITextViewStyle>;
};

export const UITextView = React.forwardRef<TextInput, UITextViewProps>(
    function UITextViewForwarded(
        {
            style,
            placeholderTextColor = ColorVariants.TextSecondary,
            autoFocus,
            ...rest
        }: UITextViewProps,
        passedRef,
    ) {
        const fallbackRef = React.useRef<TextInput>(null);
        const ref = passedRef || fallbackRef;
        const theme = useTheme();
        const autoFocusProp = (global as any).UIKIT_NAVIGATION_AUTO_FOCUS_PATCH
            ? // See @tonlabs/uikit.navigation -> useAutoFocus
              (global as any).UIKIT_NAVIGATION_AUTO_FOCUS_PATCH(ref, autoFocus)
            : autoFocus;

        return (
            <TextInput
                ref={ref}
                {...rest}
                autoFocus={autoFocusProp}
                // @ts-ignore
                // This is our custom prop, we do it in native for Android
                noPersonalizedLearning={false}
                placeholderTextColor={theme[placeholderTextColor]}
                selectionColor={theme[ColorVariants.TextAccent]}
                // @ts-ignore
                keyboardAppearance={theme[ColorVariants.KeyboardStyle]}
                underlineColorAndroid="transparent"
                style={[
                    styles.input,
                    style,
                    {
                        color: theme[ColorVariants.TextPrimary],
                    },
                    Typography[TypographyVariants.ParagraphText],
                    styles.resetStyles,
                ]}
            />
        );
    },
);

const styles = StyleSheet.create({
    input: {
        flex: 1,
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            },
            android: {
                padding: 0,
            },
        }),
    },
    resetStyles: {
        lineHeight: undefined,
    },
});

/**
 * This is useful hook if you want to listen for inputValue changes
 * But don't want to make TextInput controlled (eg. use `value` prop)
 *
 * @param useClearWithEnter boolean
 */
export function useUITextViewValue(
    ref: React.Ref<TextInput> | null,
    useClearWithEnter = false,
    { value: valueProp, onChangeText: onChangeTextProp }: UITextViewProps = {},
) {
    // Little optimisation to not re-render children on every value change
    const [inputHasValue, setInputHasValue] = React.useState(
        valueProp != null && valueProp !== '',
    );

    React.useEffect(() => {
        if (valueProp == null) {
            return;
        }

        const hasValue = valueProp.length > 0;
        if (hasValue !== inputHasValue) {
            setInputHasValue(hasValue);
        }
    }, [valueProp, inputHasValue]);

    const inputValue = React.useRef('');
    const wasClearedWithEnter = React.useRef(false);

    const onChangeText = React.useCallback(
        // Sometimes when we trying to change a value with
        // a ref's method `changeValue`, we don't want to call onChangeText prop,
        // since the call might be already from an onChangeText prop
        // and it could cause a recursive calls
        (text: string, callOnChangeProp = true) => {
            // It could be that we sent a message with "Enter" from keyboard
            // But the event with newline is fired after this
            // So, to prevent setting it, need to check a flag
            // And also check that input string is a newline
            if (
                useClearWithEnter &&
                wasClearedWithEnter.current &&
                text === '\n'
            ) {
                wasClearedWithEnter.current = false;
                return text;
            }

            inputValue.current = text;

            const hasValue = text != null ? text.length > 0 : false;

            if (hasValue !== inputHasValue) {
                setInputHasValue(hasValue);
            }

            if (callOnChangeProp && onChangeTextProp) {
                onChangeTextProp(text);
            }

            return text;
        },
        [inputHasValue, useClearWithEnter, onChangeTextProp],
    );

    const onKeyPress = React.useCallback(
        (e: any) => {
            // Enable only for web (in native e.key is undefined)
            if (useClearWithEnter && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                wasClearedWithEnter.current = true;
                return true;
            }

            return false;
        },
        [useClearWithEnter],
    );

    const clear = React.useCallback(() => {
        if (ref && 'current' in ref) {
            ref.current?.clear();
        }
        inputValue.current = '';
        setInputHasValue(false);

        if (onChangeTextProp) {
            onChangeTextProp('');
        }
    }, [ref, setInputHasValue, onChangeTextProp]);

    return {
        inputHasValue,
        inputValue,
        clear,
        onChangeText,
        onKeyPress,
    };
}

export function useFocused(
    onFocusProp: TextInputProps['onFocus'],
    onBlurProp: TextInputProps['onBlur'],
) {
    const [isFocused, setIsFocused] = React.useState(false);
    const onFocus = React.useCallback(
        (e) => {
            setIsFocused(true);

            if (onFocusProp) {
                onFocusProp(e);
            }
        },
        [onFocusProp, setIsFocused],
    );
    const onBlur = React.useCallback(
        (e) => {
            setIsFocused(false);

            if (onBlurProp) {
                onBlurProp(e);
            }
        },
        [onBlurProp, setIsFocused],
    );

    return {
        isFocused,
        onFocus,
        onBlur,
    };
}
