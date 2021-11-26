import type { ViewStyle, ImageSourcePropType } from 'react-native';

export type ContentType = 'Image' | 'Video' | 'Unknown';

export type UICollectionCardProps = {
    contentType: ContentType;
    source?: ImageSourcePropType | ImageSourcePropType[];
    title?: string;
    badge?: string | ImageSourcePropType;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type PreviewProps = {
    contentType: ContentType;
    source?: ImageSourcePropType | ImageSourcePropType[];
    style: ViewStyle;
};

export type TitleProps = {
    title?: string;
};

export type BadgeProps = {
    badge?: string | ImageSourcePropType;
};
