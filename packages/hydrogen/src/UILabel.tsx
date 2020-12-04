import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { TextProps, TextStyle, StyleProp } from 'react-native';

import { Typography, TypographyVariants } from './Typography';
import { useTheme, ColorVariants } from './Colors';

/**
 * Only those `behavioral` styles are accepted!
 */
type UILabelStyle = Pick<
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
>;

type Props = Omit<TextProps, 'style'> & {
    role?: TypographyVariants;
    color?: ColorVariants;
    style?: StyleProp<UILabelStyle>;
};

/**
 * https://reactnative.dev/docs/text
 *
 * Text component with defined styles from our design system
 *
 * IMPORTANT: You must use only `role` and `color` props
 *            to choose from pre-defined appearances
 *
 * <UILabel role={UILabelRoles.ParagraphText} color={UILabelColors.TextPrimary}>
 *     Hello world!
 * </UILabel>
 */
export const UILabel = React.forwardRef<Text, Props>(function UILabelForwarded(
    {
        role = TypographyVariants.ParagraphText,
        color: colorProp = ColorVariants.TextPrimary,
        style,
        ...rest
    }: Props,
    ref,
) {
    const theme = useTheme();
    const color = theme[colorProp];

    if (style && __DEV__) {
        // This one is just to prevent style overrides
        // putting ts-ignore or with casting to any.
        // In prod environment it won't affect performance
        // eslint-disable-next-line no-param-reassign
        style = StyleSheet.flatten(style);
        // eslint-disable-next-line no-param-reassign
        style = {
            textAlign: style.textAlign,
            textAlignVertical: style.textAlignVertical,
            textDecorationLine: style.textDecorationLine,
            textDecorationStyle: style.textDecorationStyle,
            textDecorationColor: style.textDecorationColor,
            textShadowColor: style.textShadowColor,
            textShadowOffset: style.textShadowOffset,
            textShadowRadius: style.textShadowRadius,
            textTransform: style.textTransform,
            fontVariant: style.fontVariant,
            writingDirection: style.writingDirection,
            includeFontPadding: style.includeFontPadding,
        };
    }

    return (
        <Text
            ref={ref}
            {...rest}
            style={[Typography[role], { color }, style]}
        />
    );
});

export const UILabelRoles = TypographyVariants;
export const UILabelColors = ColorVariants;
