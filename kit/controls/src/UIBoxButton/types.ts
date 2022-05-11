import type { ImageSourcePropType } from 'react-native';
import type { UIBoxButtonIconPosition, UIBoxButtonType, UIBoxButtonVariant } from './constants';
import type { UILayout } from '../types';

export type UIBoxButtonProps = {
    /**
     * Whether the button is disabled or not; if true a button is grayed out and `onPress` does no response
     */
    disabled?: boolean;
    /**
     * Source for the button icon
     */
    icon?: ImageSourcePropType;
    /**
     * Position of icon on the button
     * - `UIBoxButtonIconPosition.Left` - icon to the left near the title
     * - `UIBoxButtonIconPosition.Middle` - icon to the right near the title
     * - `UIBoxButtonIconPosition.Right` - icon at the end of the button
     */
    iconPosition?: UIBoxButtonIconPosition;
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
     * - `UIBoxButtonType.Primary` - button with current theme accent background color (default)
     * - `UIBoxButtonType.Secondary` - button with current theme primary inverted background color
     * - `UIBoxButtonType.Tertiary` - button with 1 px border style
     * - `UIBoxButtonType.Nulled` - button without visible borders and background color
     */
    type?: UIBoxButtonType;
    /**
     * Variant of the button; specific type allows to display the corresponding button action nature
     * - `UIBoxButtonVariant.Neutral` - button with regular action (default)
     * - `UIBoxButtonVariant.Negative` - button associated with some destructive action
     * - `UIBoxButtonVariant.Positive` - button associated with some affirmative action
     */
    variant?: UIBoxButtonVariant;
};
