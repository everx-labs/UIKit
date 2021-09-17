import {
    UIAlertViewContainer,
    UIAlertViewAction,
    IUIAlertView,
    UIAlertViewActionType,
} from './UIAlert';

export * from './UIAlert/types';

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIAlertView: IUIAlertView = UIAlertViewContainer;
// @ts-expect-error
// same
UIAlertView.Action = UIAlertViewAction;
UIAlertView.Action.Type = UIAlertViewActionType;
