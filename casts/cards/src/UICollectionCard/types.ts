import type { ViewStyle, ImageSourcePropType } from 'react-native';
import type { Content } from '../types';

export type UICollectionCardProps = {
    contentList: Content[];
    title?: string;
    badge?: string | ImageSourcePropType;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type PreviewProps = {
    contentList: Content[];
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
