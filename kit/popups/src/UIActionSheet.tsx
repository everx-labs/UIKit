import {
    UIActionSheetContainer,
    UIActionSheetAction,
    IUIActionSheet,
    UIActionSheetActionType,
} from './ActionSheet';
import { UIForeground } from './UIForeground';

export * from './ActionSheet/types';

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIActionSheet: IUIActionSheet = UIActionSheetContainer;
// @ts-expect-error
// same
UIActionSheet.Action = UIActionSheetAction;
UIActionSheet.Action.Type = UIActionSheetActionType;
UIActionSheet.CustomAction = UIForeground.Container;

UIActionSheet.PrimaryColumn = UIForeground.PrimaryColumn;
UIActionSheet.SecondaryColumn = UIForeground.SecondaryColumn;

UIActionSheet.ActionCell = UIForeground.ActionCell;
UIActionSheet.IconCell = UIForeground.IconCell;
UIActionSheet.NumberCell = UIForeground.NumberCell;
UIActionSheet.TextCell = UIForeground.TextCell;
