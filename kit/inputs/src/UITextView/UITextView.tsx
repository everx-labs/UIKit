import * as React from 'react';
import { TextInput, Platform, StyleSheet } from 'react-native';
import { ColorVariants, useTheme, Typography, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useAutogrow, useAutoFocus, useHandleRef } from './hooks';
import type { UITextViewProps, UITextViewRef } from './types';

const textViewTypographyVariant = TypographyVariants.ParagraphText;
const inputTypographyStyle = StyleSheet.flatten(Typography[textViewTypographyVariant]);
const textViewLineHeight = inputTypographyStyle.lineHeight ?? UILayoutConstant.smallCellHeight;

/**
 * The singleline input on the ios platform has a bug -
 * if `(lineHeight - fontSize) > 5` it starts to crop
 * letters from the bottom (letters like "g", "j").
 * Style prop `textAlignVertical` works only on Andriod.
 */
const singleLineInputLineHeightForIOS =
    inputTypographyStyle.fontSize && textViewLineHeight - inputTypographyStyle.fontSize > 5
        ? inputTypographyStyle.fontSize + 5
        : textViewLineHeight;

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
        const { autoFocus, onChange: onChangeProp, multiline } = textInputProps;

        const textInputRef = React.useRef<TextInput>(null);
        const theme = useTheme();
        const autoFocusProp = useAutoFocus(textInputRef, autoFocus);

        const { onChange, remeasureInputHeight, numberOfLines, autogrowStyle } = useAutogrow(
            textInputRef,
            textViewLineHeight,
            onChangeProp,
            multiline,
            maxNumberOfLines,
            onHeightChange,
            onNumberOfLinesChange,
        );

        useHandleRef(textInputRef, passedRef, remeasureInputHeight);

        const onLayout = React.useCallback(
            function onLayout(event) {
                textInputProps.onLayout?.(event);
                remeasureInputHeight?.();
            },
            [remeasureInputHeight, textInputProps],
        );

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
                    },
                    inputTypographyStyle,
                    multiline ? styles.inputMultiline : styles.inputSingleline,
                    autogrowStyle,
                ]}
                onChange={onChange}
                onLayout={onLayout}
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
    inputMultiline: Platform.select({
        ios: {
            /**
             * The input on the ios platform has a feature -
             * its height in `multiline={true}` mode is greater than in `multiline={false}`.
             * Experimentally, it was found that it increases from above by 4pt, and from below by 1pt.
             */
            paddingTop: -4,
            paddingBottom: -1,
        },
        default: {},
    }),
    inputSingleline: Platform.select({
        ios: {
            lineHeight: singleLineInputLineHeightForIOS,
            height: textViewLineHeight,
        },
        default: {},
    }),
});
