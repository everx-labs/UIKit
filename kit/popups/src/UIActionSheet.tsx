import {
    UIActionSheetContainer,
    UIActionSheetAction,
    IUIActionSheet,
    UIActionSheetActionType,
} from './ActionSheet';

export * from './ActionSheet/types';

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIActionSheet: IUIActionSheet = UIActionSheetContainer;
// @ts-expect-error
// same
UIActionSheet.Action = UIActionSheetAction;
UIActionSheet.Action.Type = UIActionSheetActionType;
