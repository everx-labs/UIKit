import type { ViewStyle } from 'react-native';
import type { Content } from '../types';

export type UIMediaCardProps = {
    content?: Content;
    title?: string;
    onPress?: () => void;
    loading?: boolean;
    testID?: string;
};

export type TitleProps = {
    title?: string;
};

export type QuickViewProps = {
    content?: Content;
    style: ViewStyle;
};
