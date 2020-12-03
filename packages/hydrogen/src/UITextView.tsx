import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { ColorVariants, useTheme } from './Colors';
import { Typography, TypographyVariants } from './Typography';

type Props = Omit<
    TextInputProps,
    'style' | 'placeholderTextColor' | 'underlineColorAndroid'
>;

export const UITextView = React.forwardRef<TextInput, Props>(
    function UITextViewForwarded(
        {
            // @ts-ignore
            // eslint-disable-next-line
            style,
            ...rest
        },
        ref,
    ) {
        const theme = useTheme();
        return (
            <TextInput
                ref={ref}
                {...rest}
                // @ts-ignore
                // This is our custom prop, we do it in native for Android
                noPersonalizedLearning={false}
                placeholderTextColor={theme[ColorVariants.TextTertiary]}
                underlineColorAndroid="transparent"
                style={[
                    {
                        flex: 1,
                        color: theme[ColorVariants.TextPrimary],
                    },
                    Typography[TypographyVariants.ParagraphText],
                ]}
            />
        );
    },
);

/**
 * This is useful hook if you want to listen for inputValue changes
 * But don't want to make TextInput controlled (eg. use `value` prop)
 *
 * @param useClearWithEnter boolean
 */
export function useInputValue(useClearWithEnter = false) {
    // Little optimisation to not re-render children on every value change
    const [inputHasValue, setInputHasValue] = React.useState(false);
    const inputValue = React.useRef('');
    const wasClearedWithEnter = React.useRef(false);

    const onChangeText = React.useCallback(
        (text: string) => {
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

            return text;
        },
        [inputHasValue, useClearWithEnter],
    );

    const onKeyPress = React.useCallback(
        (e: any) => {
            // Enable only for web (in native e.key is undefined)
            if (useClearWithEnter && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                wasClearedWithEnter.current = true;
                return e;
            }

            return e;
        },
        [useClearWithEnter],
    );

    return {
        inputHasValue,
        inputValue,
        onChangeText,
        onKeyPress,
    };
}
