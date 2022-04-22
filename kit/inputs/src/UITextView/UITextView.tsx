import * as React from 'react';
import { TextInput, Platform, StyleSheet } from 'react-native';
import { ColorVariants, useTheme, Typography, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useAutogrow, useAutoFocus, useHandleRef } from './hooks';
import type { UITextViewProps, UITextViewRef } from './types';

/**
 * The input on the ios platform has a feature -
 * its height in `multiline={true}` mode is greater than in `multiline={false}`.
 * Experimentally, it was found that it increases from above by 4pt, and from below by 1pt.
 */
export const EXTRA_TOP_PADDING_OF_MULTILINE_INPUT = Platform.OS === 'ios' ? 4 : 0;
export const EXTRA_BOTTOM_PADDING_OF_MULTILINE_INPUT = Platform.OS === 'ios' ? 1 : 0;

const textViewTypographyVariant = TypographyVariants.ParagraphText;
const textViewLineHeight =
    StyleSheet.flatten(Typography[textViewTypographyVariant]).lineHeight ??
    UILayoutConstant.smallCellHeight;

export const UITextView = React.forwardRef<UITextViewRef, UITextViewProps>(
    function UITextViewForwarded(
        {
            placeholderTextColor = ColorVariants.TextSecondary,
            style,
            noPersonalizedLearning,
            onHeightChange,
            maxNumberOfLines,
            onNumberOfLinesChange,
            ...textInputProps
        }: UITextViewProps,
        passedRef,
    ) {
        const {
            autoFocus,
            onContentSizeChange: onContentSizeChangeProp,
            onChange: onChangeProp,
            multiline,
        } = textInputProps;

        const textInputRef = React.useRef<TextInput>(null);
        const theme = useTheme();
        const autoFocusProp = useAutoFocus(textInputRef, autoFocus);

        const {
            onContentSizeChange,
            onChange,
            numberOfLines,
            remeasureInputHeight,
            autogrowStyle,
        } = useAutogrow(
            textInputRef,
            textViewLineHeight,
            onContentSizeChangeProp,
            onChangeProp,
            multiline,
            maxNumberOfLines,
            onHeightChange,
            onNumberOfLinesChange,
        );

        useHandleRef(textInputRef, passedRef, remeasureInputHeight);

        React.useEffect(() => {
            /**
             * We have to force a height measurement to draw it correctly at the first render
             */
            requestAnimationFrame(() => remeasureInputHeight?.());
        }, [remeasureInputHeight]);

        return (
            <TextInput
                ref={textInputRef}
                {...textInputProps}
                autoFocus={autoFocusProp}
                // This is our custom prop, we do it in native for Android
                {...(Platform.OS === 'android' ? { noPersonalizedLearning } : null)}
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
                        paddingTop: multiline ? -EXTRA_TOP_PADDING_OF_MULTILINE_INPUT : 0,
                        paddingBottom: multiline ? -EXTRA_BOTTOM_PADDING_OF_MULTILINE_INPUT : 0,
                    },
                    Typography[textViewTypographyVariant],
                    autogrowStyle,
                ]}
                onContentSizeChange={onContentSizeChange}
                onChange={onChange}
                scrollEnabled={multiline}
                numberOfLines={numberOfLines}
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
                // it's a hack for a web input to not have
                // a width equal to it's placeholder
                // (i.e. when input has a value, it pushes clear button
                //       to the right outside the boundaries)
                minWidth: 0,
            },
            android: {
                padding: 0,
            },
        }),
    },
});
