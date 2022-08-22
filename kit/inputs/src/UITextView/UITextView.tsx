import * as React from 'react';
import { TextInput, Platform, StyleSheet, LayoutChangeEvent, TextStyle } from 'react-native';
import { ColorVariants, useTheme, Typography, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useAutogrow, useAutoFocus, useHandleRef } from './hooks';
import type { UITextViewProps, UITextViewRef } from './types';

const textViewTypographyVariant = TypographyVariants.ParagraphText;
const inputTypographyStyle = StyleSheet.flatten(Typography[textViewTypographyVariant]);
const textViewLineHeight = inputTypographyStyle.lineHeight ?? UILayoutConstant.smallCellHeight;

/**
 * Android TextInput does not respond to lineHeight changes,
 * so I decided just to align input text and height with regular UILabel text and height via marginVertical.
 */
function fixAndroidTextInputHeight(): TextStyle {
    const { fontSize, lineHeight } = inputTypographyStyle;
    if (fontSize == null || lineHeight == null) {
        return {};
    }
    let textInputHeight = 0;
    /**
     * This calculation were carried out experimentally.
     */
    if (fontSize <= 20) {
        textInputHeight = 27.636363983154297;
    } else {
        textInputHeight = fontSize * 1.336;
    }

    const diff = textInputHeight - lineHeight;
    return {
        marginVertical: -diff / 2,
    };
}

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
            function onLayout(event: LayoutChangeEvent) {
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
                ...fixAndroidTextInputHeight(),
            },
        }),
    },
    inputMultiline: Platform.select({
        ios: {
            /**
             * multiline input on ios has unpredictable paddings
             * and wrong vertical text alignment.
             */
            paddingTop: 0,
            paddingBottom: 0,
            top: -1,
        },
        default: {},
    }),
    inputSingleline: Platform.select({
        ios: {
            /**
             * This was made to align the text vertically.
             */
            lineHeight: undefined,
            height: textViewLineHeight,
            top: 0.5,
        },
        default: {},
    }),
});
