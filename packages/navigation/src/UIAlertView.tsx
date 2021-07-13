import { UIAlertViewContainer, UIAlertViewAction } from './UIAlert';

export type UIAlertViewActionType = 'Primary' | 'Destructive';

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
};

export type UIAlertViewContainerProps = {
    /**
     * State of visibility
     */
    visible: boolean;
    /**
     * Title of the Alert
     */
    title: string;
    /**
     * Note of the Alert
     */
    note: string;
    /**
     * List of UIAlertView.Action
     */
    children:
        | React.ReactElement<UIAlertViewActionProps>
        | React.ReactElement<UIAlertViewActionProps>[];
    /**
     * The callback that is called when tapping on the underlay
     */
    onTapUnderlay?: () => void;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

/**
 * UIAlertView components
 */
export type UIAlertView = {
    /** Parent component that contains the actions */
    Container: React.FC<UIAlertViewContainerProps>;
    /** Action component */
    Action: React.FC<UIAlertViewActionProps>;
};

export const UIAlertView: UIAlertView = {
    Container: UIAlertViewContainer,
    Action: UIAlertViewAction,
};
