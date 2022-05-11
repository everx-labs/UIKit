import type { ColorVariants } from '@tonlabs/uikit.themes';
import type { ColorValue, ImageSourcePropType, TextStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { AnimatedStyleProp } from 'react-native-reanimated';
import type { BackgroundParams } from '../Button/types';
import type { UILayout } from '../types';
import type { UIActionButtonType } from './constants';

export type UIActionButtonProps = {
    /**
     * Whether the button is disabled or not; if true a button is grayed out and `onPress` does no response
     */
    disabled?: boolean;
    /**
     * Source for the button icon
     */
    icon?: ImageSourcePropType;
    /**
     * Allows to set top, right, bottom and left margins to the button container
     */
    layout?: UILayout;
    /**
     * Whether to display a loading indicator instead of button content or not
     */
    loading?: boolean;
    /**
     * Function will be called on button press
     */
    onPress?: () => void | Promise<void>;
    /**
     * ID for usage in tests
     */
    testID?: string;
    /**
     * Text displayed on the button
     */
    title?: string;
    /**
     * Type of the button; specific type allows to set the corresponding accent
     * - `UIActionButtonType.Primary` - button with current theme background BW color (default)
     * - `UIActionButtonType.Accent` - button with current theme background accent color
     */
    type?: UIActionButtonType;
};

export type ActionButtonAnimations = {
    hover: BackgroundParams;
    press: BackgroundParams;
};

export type ActionButtonIconProps = {
    icon?: ImageSourcePropType;
    loading?: boolean;
    color: Animated.SharedValue<string | number>;
    indicatorColor: ColorVariants;
};

export type ContentAnimations = {
    titleStyle: AnimatedStyleProp<TextStyle>;
    iconProps: { tintColor?: ColorValue };
};

export type ActionButtonColors = {
    normal: ColorVariants;
    hover: ColorVariants;
    pressed: ColorVariants;
    disabled: ColorVariants;
};

export type ActionButtonColorScheme = {
    overlay: ActionButtonColors;
    content: ActionButtonColors;
};
