import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { GestureRef } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

import type { ColorVariants } from '@tonlabs/uikit.themes';

export interface PressableProps {
    /**
     * Function will be called on button press
     */
    onPress?: () => void | Promise<void>;
    /**
     * Function will be called on button long press
     */
    onLongPress?: () => void | Promise<void>;
    /**
     * Whether the button is disabled or not.
     * If the value is true, the button does not respond to events.
     */
    disabled?: boolean;
    /**
     * Whether there is should be visual feedback for loading state.
     */
    loading?: boolean;
    /**
     * Use usePressableContentNumericParameter hook in the child components to animate them.
     * Use usePressableContentColor hook in the child components to animate their colors.
     */
    children: React.ReactNode;
    /**
     * The `UIPressableArea` behaves like a usual `View` container
     * and accepts all the appropriate styles
     */
    style?: StyleProp<ViewStyle>;
    /**
     * ID for usage in tests
     */
    testID?: string;
    /**
     * Compatibility with https://docs.swmansion.com/react-native-gesture-handler/docs/next/guides/upgrading-to-2#replacing-waitfor-and-simultaneoushandlers
     */
    waitFor?: Exclude<GestureRef, number>;
}

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

export type AnimatedImageTintColorProps =
    | {
          animatedProps: Partial<{ tintColor: string }>;
      }
    | { tintColor: string };
