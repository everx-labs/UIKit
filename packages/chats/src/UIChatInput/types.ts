import type { StyleProp, ViewStyle, TextStyle, ImageSourcePropType } from "react-native";

// TODO: should be in UIActionSheet
export type MenuItem = {
    style?: StyleProp<ViewStyle>;
    title: string;
    titleStyle?: StyleProp<TextStyle>;
    details?: string;
    detailsStyle?: StyleProp<TextStyle>;
    chosen?: boolean;
    reversedColors?: boolean;
    onPress: () => void | Promise<void>;
};

export type QuickActionItem = {
    key: string;
    testID: string;
    onPress: () => void | Promise<void>;
    icon?: ImageSourcePropType;
    title?: string;
};

export type ImageSize = { width: number; height: number };

export type OnSendMedia = (data: any, imageSize: ImageSize) => void;
export type OnSendDocument = (data: any, name: string) => void;
