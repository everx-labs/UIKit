import type { ImageSourcePropType } from 'react-native';
import type { UIWideBoxButtonType } from './constants';

export type UIWideBoxButtonProps = {
    /**
     * Type of the button; specific type allows to set the corresponding accent
     * - `UIWideBoxButtonType.Primary` - button with current theme accent background color (default)
     * - `UIWideBoxButtonType.Secondary` - button with current theme accent border color
     * - `UIWideBoxButtonType.Nulled` - button without visible borders and background color
     */
    type?: UIWideBoxButtonType;
    /**
     * Text displayed on the button
     */
    title: string;
    /**
     * Text displayed under the button
     */
    caption?: string;
    /**
     * Source for the button icon
     */
    icon?: ImageSourcePropType;
    /**
     * Function will be called on button press
     */
    onPress?: () => void | Promise<void>;
    /**
     * Whether the button is disabled or not; if true a button is grayed out and `onPress` does no response
     */
    disabled?: boolean;
    /**
     * Allows to set top, right, bottom and left margins to the button container
     */
    layout?: UIWideBoxButtonLayout;
    /**
     * Whether to display a loading indicator instead of button content or not
     */
    loading?: boolean;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type UIWideBoxButtonLayout = {
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
};
