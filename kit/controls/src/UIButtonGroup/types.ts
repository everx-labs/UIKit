import type { ImageSourcePropType } from 'react-native';
import type { UILayout } from '../types';
import type { UIButtonGroupActionIconPosition } from './constants';

export type UIButtonGroupActionProps = {
    /**
     * Title
     */
    children: string;
    /**
     * The callback that is called when tapping on the action
     */
    onPress: () => void | Promise<void>;
    /**
     * Function will be called on action press longer than 500 milliseconds
     */
    onLongPress?: () => void | Promise<void>;
    /**
     * Source of the icon
     */
    icon?: ImageSourcePropType;
    /**
     * Type of UIButtonGroupAction
     * @default UIButtonGroupActionIconPosition.Left
     */
    iconPosition?: UIButtonGroupActionIconPosition;
    /**
     * Whether the button is disabled or not.
     * If true a button is grayed out and `onPress` does no response
     */
    disabled?: boolean;
    /**
     * Whether the button is in loading state or not.
     */
    loading?: boolean;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type UIButtonGroupChildType = React.ReactElement<UIButtonGroupActionProps>;

export type UIButtonGroupProps = {
    /**
     * List of UIButtonGroupAction
     * There can be no more than one child with the "Cancel" UIButtonGroupActionType.
     */
    children?: UIButtonGroupChildType | (UIButtonGroupChildType | UIButtonGroupChildType[])[];
    /**
     * Layout around UIButtonGroup
     */
    layout?: UILayout;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

/**
 * UIButtonGroup components interface
 */
export type IUIButtonGroup = React.FC<UIButtonGroupProps> & {
    /** Action component */
    Action: React.FC<UIButtonGroupActionProps>;
};
