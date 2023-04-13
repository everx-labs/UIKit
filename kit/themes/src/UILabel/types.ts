import type * as React from 'react';
import type {
    ColorValue,
    FlexStyle,
    StyleProp,
    TextProps,
    TextStyle,
    TransformsStyle,
    ViewStyle,
} from 'react-native';

import type { LocalizationString } from '@tonlabs/localization';

import type { TypographyVariants } from '../Typography';
import type { ColorVariants } from '../Colors';

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

type UILabelBasicStyle = UILabelStyle & Pick<TextStyle, 'color'>;

export type UILabelBasicProps = Omit<TextProps, 'style' | 'role'> & {
    role?: TypographyVariants;
    color?: ColorValue;
    style?: StyleProp<UILabelBasicStyle>;
    children?: React.ReactNode | LocalizationString;
    textComponent?: React.ComponentType<any>;
};

export type UILabelProps = UILabelBasicProps & {
    color?: ColorVariants;
    style?: StyleProp<UILabelStyle>;
};
