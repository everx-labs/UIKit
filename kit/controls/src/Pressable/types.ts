import type { ColorVariants } from '@tonlabs/uikit.themes';
import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type PressableProps = {
    onPress?: () => void | Promise<void>;
    onLongPress?: () => void | Promise<void>;
    disabled?: boolean;
    loading?: boolean;
    /**
     * Use usePressableContentNumericParameter hook in the child components to animate them.
     * Use usePressableContentColor hook in the child components to animate their colors.
     */
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export type PressableStateType = 'Initial' | 'Disabled' | 'Hovered' | 'Pressed' | 'Loading';

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

export type PressableNumericParameters = {
    initial?: number;
    pressed?: number;
    hovered?: number;
    disabled?: number;
    loading?: number;
};
