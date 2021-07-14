import { UIAlertViewContainer, UIAlertViewAction } from './UIAlert';

export type UIAlertViewActionType = 'Neutral' | 'Negative' | 'Сancel';

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
     * ID for usage in tests
     */
    testID?: string;
};

/**
 * UIAlertView components
 */
export type UIAlertView = React.FC<UIAlertViewContainerProps> & {
    /** Action component */
    Action: React.FC<UIAlertViewActionProps>;
};

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIAlertView: UIAlertView = UIAlertViewContainer;
UIAlertView.Action = UIAlertViewAction;
