import * as React from 'react';
import { ColorValue, Text } from 'react-native';

// @ts-expect-error
import TextAncestorContext from 'react-native/Libraries/Text/TextAncestor';

import { Typography, TypographyVariants } from '../Typography';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import type { Props } from './types';
// @ts-expect-error
import { useLabelDataSet } from './useLabelDataSet';

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

    const dataSet = useLabelDataSet(rest.children);

    return (
        <TextComponent
            ref={ref}
            {...rest}
            style={[
                style,
                // Override font and color styles
                // If there were any
                fontStyle,
                colorStyle,
            ]}
            // @ts-expect-error
            dataSet={dataSet}
        />
    );
});
