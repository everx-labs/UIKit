import type { ImageSourcePropType } from 'react-native';
import type { UIPillButtonIconPosition, UIPillButtonVariant } from './constants';
import type { UILayout } from '../types';

export type UIPillButtonProps = {
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
     * - `UIPillButtonIconPosition.Left` - icon to the left near the title
     * - `UIPillButtonIconPosition.Right` - icon to the right near the title
     */
    iconPosition?: UIPillButtonIconPosition;
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
     * Variant of the button; specific type allows to display the corresponding button action nature
     * - `UIPillButtonVariant.Neutral` - button with regular action (default)
     * - `UIPillButtonVariant.Negative` - button associated with some destructive action
     * - `UIPillButtonVariant.Positive` - button associated with some affirmative action
     */
    variant?: UIPillButtonVariant;
};
