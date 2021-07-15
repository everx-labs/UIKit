import { UIActionSheetContainer, UIActionSheetAction } from './ActionSheet';

export type UIActionSheetActionType = 'Neutral' | 'Negative' | 'Сancel' | 'Disabled';

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

export type UIActionSheetContainerProps = {
    /**
     * State of visibility
     */
    visible: boolean;
    /**
     * Note of the ActionSheet
     */
    note: string;
    /**
     * List of UIActionSheetAction
     * There can be no more than one child with the "Cancel" UIActionSheetActionType.
     */
    children:
        | React.ReactElement<UIActionSheetActionProps>
        | React.ReactElement<UIActionSheetActionProps>[];
    /**
     * ID for usage in tests
     */
    testID?: string;
};

/**
 * UIActionSheet components
 */
export type UIActionSheet = React.FC<UIActionSheetContainerProps> & {
    /** Action component */
    Action: React.FC<UIActionSheetActionProps>;
};

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIActionSheet: UIActionSheet = UIActionSheetContainer;
UIActionSheet.Action = UIActionSheetAction;
