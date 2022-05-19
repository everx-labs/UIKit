import type { ImageSourcePropType } from 'react-native';
import type { UILayout } from '../types';
import type {
    UIMsgButtonCornerPosition,
    UIMsgButtonIconPosition,
    UIMsgButtonType,
    UIMsgButtonVariant,
} from './constants';

export type UIMsgButtonProps = {
    /**
     * Auxiliary text displayed on the button under the main title
     */
    caption?: string;
    /**
     * Position of non-rounded corner of the button
     * - `UIMsgButtonCornerPosition.BottomLeft` - bottom left corner has zero radius
     * - `UIMsgButtonCornerPosition.BottomRight` - bottom right corner has zero radius
     * - `UIMsgButtonCornerPosition.TopLeft` - top left corner has zero radius
     * - `UIMsgButtonCornerPosition.TopRight` - top right corner has zero radius
     */
    cornerPosition?: UIMsgButtonCornerPosition;
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
     * - `UIMsgButtonIconPosition.Left` - icon to the left near the title
     * - `UIMsgButtonIconPosition.Middle` - icon to the right near the title
     * - `UIMsgButtonIconPosition.Right` - icon at the end of the button
     */
    iconPosition?: UIMsgButtonIconPosition;
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
     * - `UIMsgButtonType.Primary` - button with current theme accent background color (default)
     * - `UIMsgButtonType.Secondary` - button with 1 px border style and current theme accent line border color
     */
    type?: UIMsgButtonType;
    /**
     * Variant of the button; specific type allows to display the corresponding button action nature
     * - `UIMsgButtonVariant.Neutral` - button with regular action (default)
     * - `UIMsgButtonVariant.Negative` - button associated with some destructive action
     * - `UIMsgButtonVariant.Positive` - button associated with some affirmative action
     */
    variant?: UIMsgButtonVariant;
};
