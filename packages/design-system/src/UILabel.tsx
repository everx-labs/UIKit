import * as React from 'react';
import { Text } from 'react-native';
import type { TextProps } from 'react-native';

import { Typography, TypographyVariants } from './Typography';
import { useTheme, ColorVariants } from './Colors';

type Props = Omit<TextProps, 'style'> & {
    role?: TypographyVariants;
    color?: ColorVariants;
};

/**
 * https://reactnative.dev/docs/text
 *
 * Text component with defined styles from our design system
 *
 * IMPORTANT: no style prop will be available,
 *            you must use only `role` and `color` props
 *            to choose from pre-defined appearances
 *
 *
 * <UILabel role={UILabelRoles.ParagraphText} color={UILabelColors.TextPrimary}>
 *     Hello world!
 * </UILabel>
 *
 */
export const UILabel = React.forwardRef<Text, Props>(function UILabelForwarded(
    {
        role = TypographyVariants.ParagraphText,
        color: colorProp = ColorVariants.TextPrimary,
        ...rest
    }: Props,
    ref,
) {
    const theme = useTheme();
    const color = theme[colorProp];

    return <Text ref={ref} {...rest} style={[Typography[role], { color }]} />;
});

export const UILabelRoles = TypographyVariants;
export const UILabelColors = ColorVariants;
