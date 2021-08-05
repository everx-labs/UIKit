import * as React from 'react';
import { ColorValue, Text, TransformsStyle, ViewStyle } from 'react-native';
import type { TextProps, TextStyle, StyleProp, FlexStyle } from 'react-native';

// @ts-expect-error
import TextAncestorContext from 'react-native/Libraries/Text/TextAncestor';

import { LocalizationString } from '@tonlabs/uikit.localization';

import { Typography, TypographyVariants } from './Typography';
import { useTheme, ColorVariants } from './Colors';

/**
 * Only those `behavioral` styles from Text are accepted!
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
> &
    Pick<ViewStyle, 'backfaceVisibility' | 'opacity' | 'elevation'> &
    FlexStyle &
    TransformsStyle;

type Props = Omit<TextProps, 'style'> & {
    role?: TypographyVariants;
    color?: ColorVariants;
    style?: StyleProp<UILabelStyle>;
    children?: React.ReactNode | LocalizationString;
    textComponent?: React.ComponentType<any>;
};

/**
 * https://reactnative.dev/docs/text
 *
 * Text component with defined styles from our design system
 *
 * IMPORTANT: You must use only `role` and `color` props
 *            to choose from pre-defined appearances.
 *            Color and font styles would be overrided anyway.
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
        textComponent,
        ...rest
    }: Props,
    ref,
) {
    const theme = useTheme();
    const isNested = React.useContext(TextAncestorContext);

    const font = Typography[role];
    const fontStyle = isNested
        ? [
              font,
              {
                  // If <Text> is nested in another one
                  // different lineHeight value, could break
                  // layout on Android, hence we set it to null
                  // to just use lineHeight from a parent
                  lineHeight: undefined,
              },
          ]
        : font;

    const colorStyle: { color: ColorValue } = React.useMemo(
        () => ({
            color: theme[colorProp],
        }),
        [theme, colorProp],
    );

    const TextComponent = textComponent || Text;

    const isLocalizedString = rest.children instanceof LocalizationString;

    return (
        <TextComponent
            // @ts-expect-error
            ref={ref}
            {...rest}
            {...(isLocalizedString ? { dataSet: { lokalise: true, key: rest.children.path } } : {})}
            style={[
                style,
                // Override font and color styles
                // If there were any
                fontStyle,
                colorStyle,
            ]}
        />
    );
});

export const UILabelRoles = TypographyVariants;
export const UILabelColors = ColorVariants;
