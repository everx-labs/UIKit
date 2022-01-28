import type React from 'react';
import type { NativeMethods } from 'react-native';
import type {
    PrimaryColumnProps,
    SecondaryColumnProps,
    UIForegroundActionProps,
    UIForegroundIconProps,
    UIForegroundNumberProps,
    UIForegroundTextProps,
    UIForegroundType,
} from '../UIForeground';

// eslint-disable-next-line no-shadow
export enum UIMenuActionType {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Disabled = 'Disabled',
}

export type UIMenuActionProps = {
    /**
     * Type of UIMenuAction
     */
    type: UIMenuActionType;
    /**
     * Title
     */
    title: string;
    /**
     * The callback that is called when tapping on the action
     */
    onPress: () => void;
};

export type UIMenuContainerChildType = React.ReactElement<UIMenuActionProps>;
export type UIMenuContainerProps = {
    /**
     * State of visibility
     */
    visible: boolean;
    /**
     * A callback that is called when the menu wants to be closed.
     *
     * One have to set `visible` to `false` in this callback,
     * as component is controlled.
     */
    onClose: () => void;
    /**
     * The ref of the element that shows the menu.
     * It is used to position the menu
     */
    targetRef: React.RefObject<NativeMethods>;
    /**
     * List of UIMenuAction
     * There can be no more than one child with the "Cancel" UIMenuActionType.
     */
    children: UIMenuContainerChildType | (UIMenuContainerChildType | UIMenuContainerChildType[])[];
    /**
     * ID for usage in tests
     */
    testID?: string;
};

/**
 * UIMenu components interface
 */
export type IUIMenu = React.FC<UIMenuContainerProps> & {
    /** Action component */
    Action: React.FC<UIMenuActionProps> & { Type: typeof UIMenuActionType };
    /**
     * CustomAction component.
     * This component accepts only Columns (`UIMenu.PrimaryColumn`
     * or `UIMenu.SecondaryColumn`) components as children.
     */
    CustomAction: UIForegroundType['Container'];

    // Columns:
    /**
     * Container of the Primary (Left) column of the CustomAction.
     * This component accepts only Cells (e.g. UIMenu.ActionCell) components as children.
     */
    PrimaryColumn: React.FC<PrimaryColumnProps>;
    /**
     * Container of the Secondary (Right) column of the CustomAction.
     * This component accepts only Cells (e.g. UIMenu.ActionCell) components as children.
     */
    SecondaryColumn: React.FC<SecondaryColumnProps>;

    // Cells:
    /**
     * Pressable element (Button) of the CustomAction.
     */
    ActionCell: React.FC<UIForegroundActionProps>;
    /**
     * Icon of the CustomAction.
     */
    IconCell: React.FC<UIForegroundIconProps>;
    /**
     * Numerical value of the CustomAction.
     */
    NumberCell: React.FC<UIForegroundNumberProps>;
    /**
     * Text content of the CustomAction.
     */
    TextCell: React.FC<UIForegroundTextProps>;
};
