import type { ColorVariants } from '@tonlabs/uikit.themes';
import type { StyleProp, ViewStyle } from 'react-native';

export type PressableProps = {
    onPress?: () => void | Promise<void>;
    onLongPress?: () => void | Promise<void>;
    disabled?: boolean;
    loading?: boolean;
    /**
     * Use usePressableContentColor hook in the child components to animate their colors.
     */
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export type PressableColors = {
    initialColor: ColorVariants;
    pressedColor: ColorVariants;
    hoveredColor: ColorVariants;
    disabledColor: ColorVariants;
    loadingColor: ColorVariants;
};

export type PressableColorScheme = {
    initialColor: string;
    pressedColor: string;
    hoveredColor: string;
    disabledColor: string;
    loadingColor: string;
};
