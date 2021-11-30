import type { ViewStyle, ImageSourcePropType, ImageURISource } from 'react-native';

export type ContentType = 'Image' | 'Video' | 'Unknown';

export type ContentSource = ImageURISource;

export type Content = {
    contentType: ContentType;
    source: ContentSource;
};

export type UICollectionCardProps = {
    contentList: Content[] | null;
    title?: string;
    badge?: string | ImageSourcePropType;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type PreviewProps = {
    contentList: Content[] | null;
    style: ViewStyle;
};

export type TitleProps = {
    title?: string;
};

export type BadgeProps = {
    badge?: string | ImageSourcePropType;
};

export type CollectionSlideProps = {
    content: Content;
    style: ViewStyle;
};
