import { UIMenuContainer, UIMenuAction, UIMenuActionType, IUIMenu } from './Menu';
import { UIForeground } from './UIForeground';

export * from './Menu/types';

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIMenu: IUIMenu = UIMenuContainer;
// @ts-expect-error
// the same error
UIMenu.Action = UIMenuAction;
UIMenu.Action.Type = UIMenuActionType;
UIMenu.CustomAction = UIForeground.Container;

UIMenu.PrimaryColumn = UIForeground.PrimaryColumn;
UIMenu.SecondaryColumn = UIForeground.SecondaryColumn;

UIMenu.ActionCell = UIForeground.ActionCell;
UIMenu.IconCell = UIForeground.IconCell;
UIMenu.NumberCell = UIForeground.NumberCell;
UIMenu.TextCell = UIForeground.TextCell;
