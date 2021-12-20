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

export type QuickViewProps = {
    content?: MediaCardContent;
    style: ViewStyle;
};
