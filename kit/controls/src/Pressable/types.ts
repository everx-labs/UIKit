import type { ColorVariants } from '@tonlabs/uikit.themes';
import type { StyleProp, ViewStyle } from 'react-native';

export type PressableProps = {
    onPress?: () => void | Promise<void>;
    onLongPress?: () => void | Promise<void>;
    disabled?: boolean;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    testID?: string;
} & PressableColors;

export type PressableColors = {
    initialColor?: ColorVariants;
    pressedColor?: ColorVariants;
    hoveredColor?: ColorVariants;
    disabledColor?: ColorVariants;
};

export type PressableColorScheme = {
    initialColor: string;
    pressedColor: string;
    hoveredColor: string;
    disabledColor: string;
};
