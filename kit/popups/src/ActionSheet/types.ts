import type React from 'react';
import type { ContainerProps, UIForegroundType } from '../UIForeground';

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
    /** CustomAction component */
    CustomAction: UIForegroundType['Container'];
} & Omit<UIForegroundType, 'Container'>;
