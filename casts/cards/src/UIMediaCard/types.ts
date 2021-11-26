import type { ImageSourcePropType, ViewStyle } from 'react-native';

export type ContentType = 'Image' | 'Video' | 'Unknown';

export type UIMediaCardProps = {
    contentType: ContentType;
    title?: string;
    onPress?: () => void;
    source?: ImageSourcePropType;
    loading?: boolean;
    testID?: string;
};

export type TitleProps = {
    title?: string;
};

export type QuickViewProps = {
    contentType: ContentType;
    source?: ImageSourcePropType;
    style: ViewStyle;
};
