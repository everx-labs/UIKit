import type { ColorVariants } from '@tonlabs/uikit.themes';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

export type PressableProps = {
    onPress?: () => void | Promise<void>;
    onLongPress?: () => void | Promise<void>;

    disabled?: boolean;

    // Colors:
    initialColor: ColorVariants;
    pressedColor: ColorVariants;
    hoveredColor: ColorVariants;
    disabledColor: ColorVariants;

    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export type PressableColorScheme = {
    initialColor: ColorValue;
    pressedColor: ColorValue;
    hoveredColor: ColorValue;
    disabledColor: ColorValue;
};
