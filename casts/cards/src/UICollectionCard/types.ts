import type { ViewStyle, ImageSourcePropType } from 'react-native';
import type { MediaCardContent } from '../types';

export type UICollectionCardProps = {
    /**
     * Media content array
     */
    contentList?: MediaCardContent[];
    /**
     * Card title
     */
    title?: string;
    /**
     * Displays the number of items in the collection or an image
     */
    badge?: string | ImageSourcePropType;
    /**
     * Сallback called by clicking/tapping on the card
     */
    onPress?: () => void;
    /**
     * Used to display the data loading process
     */
    loading?: boolean;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type PreviewProps = {
    contentList?: MediaCardContent[];
    /**
     * The callback is called when all content elements fail
     */
    onFailure: () => void;
    style: ViewStyle;
};

export type BadgeProps = {
    badge?: string | ImageSourcePropType;
};

export type CollectionSlideProps = {
    content: MediaCardContent;
    style: ViewStyle;
    isVisible: boolean;
    onLoad: () => void;
    onError: () => void;
};
