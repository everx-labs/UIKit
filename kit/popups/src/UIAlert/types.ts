import type { UIImageProps } from '@tonlabs/uikit.media';

// eslint-disable-next-line no-shadow
export enum UIAlertViewActionType {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Cancel = 'Cancel',
}

export type UIAlertViewActionProps = {
    /**
     * Type of UIAlertViewAction
     */
    type: UIAlertViewActionType;
    /**
     * Title
     */
    title: string;
    /**
     * The callback that is called when tapping on the action
     */
    onPress: () => void;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type UIAlertViewIcon = Pick<UIImageProps, 'source' | 'tintColor'>;

export type UIAlertViewContainerProps = {
    /**
     * State of visibility
     */
    visible: boolean;
    /**
     * Title of the Alert
     */
    title?: string;
    /**
     * Note of the Alert
     */
    note?: string;
    /**
     * Icon in the header of the Alert
     */
    icon?: UIAlertViewIcon;
    /**
     * List of UIAlertView.Action
     * There can be no more than one child with the "Cancel" UIAlertViewActionType.
     */
    children:
        | React.ReactElement<UIAlertViewActionProps>
        | React.ReactElement<UIAlertViewActionProps>[];
    /**
     * ID for usage in tests
     */
    testID?: string;
};

/**
 * UIAlertView components interface
 */
export type IUIAlertView = React.FC<UIAlertViewContainerProps> & {
    /** Action component */
    Action: React.FC<UIAlertViewActionProps> & { Type: typeof UIAlertViewActionType };
};
