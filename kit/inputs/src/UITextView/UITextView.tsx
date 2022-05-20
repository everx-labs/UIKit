import * as React from 'react';
import { TextInput, Platform, StyleSheet } from 'react-native';
import { ColorVariants, useTheme, Typography, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useAutogrow, useAutoFocus, useHandleRef } from './hooks';
import type { UITextViewProps, UITextViewRef } from './types';

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
                    multiline ? styles.inputMultiline : null,
                    Typography[textViewTypographyVariant],
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
});
