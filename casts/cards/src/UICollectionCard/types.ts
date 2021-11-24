import type React from 'react';
import type { UIImageProps } from '@tonlabs/uikit.media';
import type { ViewStyle, ImageSourcePropType } from 'react-native';

export type ContentType = 'Image' | 'Video' | 'Unknown';

export type UICollectionCardProps = {
    contentType: ContentType;
    sourceList?: ImageSourcePropType[];
    title?: string;
    badge?: number | React.ReactElement<UIImageProps>;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type PreviewProps = {
    contentType: ContentType;
    sourceList?: ImageSourcePropType[];
    style: ViewStyle;
};

export type TitleProps = {
    title?: string;
};

export type BadgeProps = {
    badge?: number | React.ReactElement<UIImageProps>;
};
