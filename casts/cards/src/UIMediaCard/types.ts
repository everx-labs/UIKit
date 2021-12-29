import type { ViewStyle } from 'react-native';
import type { MediaCardContent } from '../types';

export type UIMediaCardProps = {
    /**
     * Media content of the card
     */
    content?: MediaCardContent;
    /**
     * Card title
     */
    title?: string;
    /**
     * This is the message displayed when it is not possible to load media content
     * default: the phrase from `uiLocalized.NotSupportedMedia`
     */
    notSupportedMessage?: string;
    /**
     * Сallback called by clicking/tapping on the card
     */
    onPress?: () => void;
    /**
     * Used to display the data loading process
     */
    loading?: boolean;
    /**
     * Aspect ratio of the content to help determine height of the card.
     * (the width is equal to the width of the parent container)
     * Default value is 1.
     */
    aspectRatio?: number;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type QuickViewProps = {
    content?: MediaCardContent;
    style: ViewStyle;
};
