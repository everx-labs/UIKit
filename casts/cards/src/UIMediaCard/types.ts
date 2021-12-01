import type { ViewStyle } from 'react-native';
import type { MediaCardContent } from '../types';

export type UIMediaCardProps = {
    content?: MediaCardContent;
    title?: string;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type QuickViewProps = {
    content?: MediaCardContent;
    style: ViewStyle;
};
