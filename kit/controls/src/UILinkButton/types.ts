import type { ImageSourcePropType } from 'react-native';
import type { UILayout } from '../types';
import type {
    UILinkButtonIconPosition,
    UILinkButtonSize,
    UILinkButtonType,
    UILinkButtonVariant,
} from './constants';

export type UILinkButtonProps = {
    /**
     * Auxiliary text displayed under the main title
     */
    caption?: string;
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
     * - `UILinkButtonIconPosition.Left` - icon to the left near the title
     * - `UILinkButtonIconPosition.Middle` - icon to the right near the title
     * - `UILinkButtonIconPosition.Right` - icon at the end of the button
     */
    iconPosition?: UILinkButtonIconPosition;
    /**
     * Allows to set top, right, bottom and left margins to the button container
     */
    layout?: UILayout;
    /**
     * Whether to display a loading indicator instead of button content or not
     */
    loading?: boolean;
    /**
     * Function will be called on button press longer than 500 milliseconds
     */
    onLongPress?: () => void | Promise<void>;
    /**
     * Function will be called on button press
     */
    onPress?: () => void | Promise<void>;
    /**
     * Size property for button height regulation
     * - `UILinkButtonSize.Small` - button with height 24
     * - `UILinkButtonSize.Normal` - button with height 48 (default)
     */
    size?: UILinkButtonSize;
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
     * - `UILinkButtonType.Link` - button with current theme accent title color (default)
     * - `UILinkButtonType.Menu` - button with current theme primary title color
     */
    type?: UILinkButtonType;
    /**
     * Variant of the button; specific type allows to display the corresponding button action nature
     * - `UILinkButtonVariant.Neutral` - button with regular action (default)
     * - `UILinkButtonVariant.Negative` - button associated with some destructive action
     * - `UILinkButtonVariant.Positive` - button associated with some affirmative action
     */
    variant?: UILinkButtonVariant;
};
