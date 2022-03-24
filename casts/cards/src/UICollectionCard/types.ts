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
     * This is the message displayed when it is not possible
     * to load any of the media content elements
     * default: the phrase from `uiLocalized.NotSupportedMedia`
     */
    notSupportedMessage?: string;
    /**
     * Displays the number of items in the collection or an image
     */
    badge?: string | ImageSourcePropType;
    /**
     * Callback called by clicking/tapping on the card
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
    onFailure: (error: Error) => void;
    style: ViewStyle;
};

export type BadgeProps = {
    badge?: string | ImageSourcePropType;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type CollectionSlideProps = {
    content: MediaCardContent;
    style: ViewStyle;
    isVisible: boolean;
    onLoad: (content: MediaCardContent) => void;
    onError: (error: Error, content: MediaCardContent) => void;
};
