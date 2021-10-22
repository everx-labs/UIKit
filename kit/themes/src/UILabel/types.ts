import type * as React from 'react';
import type {
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

export type Props = Omit<TextProps, 'style'> & {
    role?: TypographyVariants;
    color?: ColorVariants;
    style?: StyleProp<UILabelStyle>;
    children?: React.ReactNode | LocalizationString;
    textComponent?: React.ComponentType<any>;
};
