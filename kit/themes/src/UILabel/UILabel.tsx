import * as React from 'react';
import { ColorValue, Platform, Text } from 'react-native';

// @ts-expect-error
import TextAncestorContext from 'react-native/Libraries/Text/TextAncestor';

import { Typography, TypographyVariants } from '../Typography';
import { ColorVariants, useTheme } from '../Colors';
import type { Props } from './types';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { useLabelDataSet } from './useLabelDataSet';
import { makeStyles } from '../makeStyles';

const useStyles = makeStyles((numberOfLines: number): { textMultiLine: any } => {
    if (Platform.OS !== 'web' || numberOfLines == null) {
        return {
            textMultiLine: null,
        };
    }

    return {
        textMultiLine: {
            // @ts-ignore
            display: '-webkit-box',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: numberOfLines,
        },
    };
});

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
        numberOfLines,
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
    const styles = useStyles(numberOfLines);

    return (
        <TextComponent
            ref={ref}
            {...rest}
            // It's also part of a fix below with textMultiline
            numberOfLines={Platform.select({ web: undefined, default: numberOfLines })}
            style={[
                style,
                // Override font and color styles
                // If there were any
                fontStyle,
                colorStyle,
                /**
                 * Applying a fix until it isn't merged to RNW
                 * https://github.com/necolas/react-native-web/pull/2113/files
                 *
                 * TODO: delete it when update for RNW is there! (fix was for 0.17.1)
                 */
                styles.textMultiLine,
            ]}
            // @ts-ignore
            dataSet={dataSet}
        />
    );
});
