import {
    UIActionSheetContainer,
    UIActionSheetAction,
    IUIActionSheet,
} from './ActionSheet';

export * from './ActionSheet/types';

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIActionSheet: IUIActionSheet = UIActionSheetContainer;
UIActionSheet.Action = UIActionSheetAction;
