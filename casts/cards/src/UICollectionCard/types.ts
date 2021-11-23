import type React from 'react';
import type { UIImageProps } from '@tonlabs/uikit.media';
import type { ViewStyle, ImageSourcePropType } from 'react-native';

export type UICollectionCardProps = {
    title?: string;
    badge?: number | React.ReactElement<UIImageProps>;
    onPress?: () => void;
    imageSourceList?: ImageSourcePropType[];
    loading?: boolean;
    testID?: string;
};

export type QuickViewProps = {
    imageSourceList?: ImageSourcePropType[];
    style: ViewStyle;
};

export type TitleProps = {
    title?: string;
};

export type BadgeProps = {
    badge?: number | React.ReactElement<UIImageProps>;
};
