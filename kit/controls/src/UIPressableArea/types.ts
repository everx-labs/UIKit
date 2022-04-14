import type { StyleProp, ViewStyle } from 'react-native';

export type UIPressableAreaProps = {
    /**
     * Use it to define edge scaling points of events.
     */
    scaleParameters?: UIPressableAreaScaleParameters;
    /**
     * Children of PressableArea.
     */
    children: React.ReactNode;
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
     * The `UIPressableArea` behaves like a usual `View` container
     * and accepts all the appropriate styles
     */
    style?: StyleProp<ViewStyle>;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type UIPressableAreaScaleParameters = {
    /**
     * Scale value in default state (without events)
     */
    initial?: number; // default is 1
    /**
     * Scale value in pressed state
     */
    pressed?: number; // default is 0.95
    /**
     * Scale value in hovered state
     */
    hovered?: number; // default is 1.02
};
