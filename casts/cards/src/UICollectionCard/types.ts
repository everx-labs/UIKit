import type { ViewStyle, ImageSourcePropType } from 'react-native';
import type { MediaCardContent } from '../types';

export type UICollectionCardProps = {
    contentList: MediaCardContent[];
    title?: string;
    badge?: string | ImageSourcePropType;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type PreviewProps = {
    contentList: MediaCardContent[];
    style: ViewStyle;
};

export type BadgeProps = {
    badge?: string | ImageSourcePropType;
};

export type CollectionSlideProps = {
    content: MediaCardContent;
    style: ViewStyle;
};
