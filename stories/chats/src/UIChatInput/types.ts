import type { ImageSourcePropType } from 'react-native';

export type QuickActionItem = {
    key: string;
    testID: string;
    onPress: () => void | Promise<void>;
    icon?: ImageSourcePropType;
    title?: string;
};

export type ImageSize = { width: number; height: number };

export type OnSendText = (text: string) => void;
export type OnSendMedia = (data: any, imageSize: ImageSize | null) => void;
export type OnSendDocument = (data: any, title: string) => void;
export type OnHeightChange = (height: number) => void;

export type Shortcut = {
    title: string;
    onPress: () => void | Promise<void>;
    isDanger?: boolean;
    testID?: string;
    key?: string;
};
