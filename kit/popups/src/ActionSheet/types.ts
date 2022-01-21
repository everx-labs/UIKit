import type {
    PrimaryColumnProps,
    SecondaryColumnProps,
    UIForegroundActionProps,
    UIForegroundIconProps,
    UIForegroundNumberProps,
    UIForegroundSectionProps,
    UIForegroundTextProps,
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
        | React.ReactElement<UIActionSheetActionProps>
        | React.ReactElement<UIActionSheetActionProps>[];
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

    // ================== Columns: ==================
    /**
     * Container of the Primary (Left) column of the UIForeground
     */
    PrimaryColumn: React.FC<PrimaryColumnProps>;
    /**
     * Container of the Secondary (Right) column of the UIForeground
     */
    SecondaryColumn: React.FC<SecondaryColumnProps>;

    // ================== Cells: ==================
    /**
     * Pressable cell (Button)
     */
    ActionCell: React.FC<UIForegroundActionProps>;
    /**
     * Icon of the UIForeground
     */
    IconCell: React.FC<UIForegroundIconProps>;
    /**
     * Numerical value of the UIForeground
     */
    NumberCell: React.FC<UIForegroundNumberProps>;
    /**
     * Bold text content of the UIForeground
     */
    SectionCell: React.FC<UIForegroundSectionProps>;
    /**
     * Text content of the UIForeground
     */
    TextCell: React.FC<UIForegroundTextProps>;
};
