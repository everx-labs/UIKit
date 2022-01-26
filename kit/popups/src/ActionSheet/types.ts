import type React from 'react';
import type {
    ContainerProps,
    PrimaryColumnProps,
    SecondaryColumnProps,
    UIForegroundActionProps,
    UIForegroundCancelProps,
    UIForegroundIconProps,
    UIForegroundNumberProps,
    UIForegroundTextProps,
    UIForegroundType,
} from '../UIForeground';

// eslint-disable-next-line no-shadow
export enum UIActionSheetActionType {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Cancel = 'Cancel',
    Disabled = 'Disabled',
}

export type UIActionSheetActionProps = {
    /**
     * Type of UIActionSheetAction
     */
    type: UIActionSheetActionType;
    /**
     * Title
     */
    title: string;
    /**
     * The callback that is called when tapping on the action
     */
    onPress: () => void;
};

export type UIActionSheetContainerChildType = React.ReactElement<
    UIActionSheetActionProps | ContainerProps
>;

export type UIActionSheetContainerProps = {
    /**
     * State of visibility
     */
    visible: boolean;
    /**
     * Note of the ActionSheet
     */
    note?: string;
    /**
     * List of UIActionSheetAction
     * There can be no more than one child with the "Cancel" UIActionSheetActionType.
     */
    children:
        | UIActionSheetContainerChildType
        | (UIActionSheetContainerChildType | UIActionSheetContainerChildType[])[];
    /**
     * ID for usage in tests
     */
    testID?: string;
};

/**
 * UIActionSheet components interface
 */
export type IUIActionSheet = React.FC<UIActionSheetContainerProps> & {
    /** Action component */
    Action: React.FC<UIActionSheetActionProps> & { Type: typeof UIActionSheetActionType };
    /**
     * CustomAction component.
     * This component accepts only Columns (`UIActionSheet.PrimaryColumn`
     * or `UIActionSheet.SecondaryColumn`) components as children.
     */
    CustomAction: UIForegroundType['Container'];

    // Columns:
    /**
     * Container of the Primary (Left) column of the CustomAction.
     * This component accepts only Cells (e.g. UIActionSheet.ActionCell) components as children.
     */
    PrimaryColumn: React.FC<PrimaryColumnProps>;
    /**
     * Container of the Secondary (Right) column of the CustomAction.
     * This component accepts only Cells (e.g. UIActionSheet.ActionCell) components as children.
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
    /**
     * Simple Cancel action of the CustomAction.
     * It should only be used in PrimaryAction as an only child.
     */
    CancelCell: React.FC<UIForegroundCancelProps>;
};
