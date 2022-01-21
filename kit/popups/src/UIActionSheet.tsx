import * as React from 'react';
import {
    UIActionSheetContainer,
    UIActionSheetAction,
    IUIActionSheet,
    UIActionSheetActionType,
} from './ActionSheet';
import { UIForeground } from './UIForeground';
import type { UIActionSheetContainerChildType } from './ActionSheet/types';

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

const foregroundList: UIActionSheetContainerChildType[] = [
    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn>
            <UIActionSheet.ActionCell onPress={() => null} title="Action" />
        </UIActionSheet.PrimaryColumn>
    </UIActionSheet.CustomAction>,

    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn>
            <UIActionSheet.ActionCell title="Section" />
        </UIActionSheet.PrimaryColumn>
        <UIActionSheet.SecondaryColumn>
            <UIActionSheet.TextCell>Text</UIActionSheet.TextCell>
        </UIActionSheet.SecondaryColumn>
    </UIActionSheet.CustomAction>,

    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn>
            <UIActionSheet.TextCell>Text</UIActionSheet.TextCell>
        </UIActionSheet.PrimaryColumn>
        <UIActionSheet.SecondaryColumn>
            <UIActionSheet.ActionCell title="Action" onPress={() => null} />
        </UIActionSheet.SecondaryColumn>
    </UIActionSheet.CustomAction>,

    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn onPress={() => null} negative>
            <UIActionSheet.ActionCell title="Negative" />
        </UIActionSheet.PrimaryColumn>
        <UIActionSheet.SecondaryColumn>
            <UIActionSheet.NumberCell>{1234567890}</UIActionSheet.NumberCell>
        </UIActionSheet.SecondaryColumn>
    </UIActionSheet.CustomAction>,

    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn onPress={() => null}>
            <UIActionSheet.ActionCell title="Action" />
        </UIActionSheet.PrimaryColumn>
        <UIActionSheet.SecondaryColumn>
            <UIActionSheet.IconCell onPress={() => null} />
        </UIActionSheet.SecondaryColumn>
    </UIActionSheet.CustomAction>,

    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn>
            <UIActionSheet.IconCell />
            <UIActionSheet.ActionCell title="Section" />
        </UIActionSheet.PrimaryColumn>
        <UIActionSheet.SecondaryColumn>
            <UIActionSheet.TextCell>Text</UIActionSheet.TextCell>
            <UIActionSheet.IconCell disabled />
        </UIActionSheet.SecondaryColumn>
    </UIActionSheet.CustomAction>,

    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn>
            <UIActionSheet.IconCell />
            <UIActionSheet.TextCell>Text</UIActionSheet.TextCell>
        </UIActionSheet.PrimaryColumn>
        <UIActionSheet.SecondaryColumn>
            <UIActionSheet.ActionCell title="Action" onPress={() => null} />
            <UIActionSheet.IconCell onPress={() => null} />
        </UIActionSheet.SecondaryColumn>
    </UIActionSheet.CustomAction>,

    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn onPress={() => null} negative>
            <UIActionSheet.IconCell />
            <UIActionSheet.ActionCell title="Negative" />
        </UIActionSheet.PrimaryColumn>
        <UIActionSheet.SecondaryColumn>
            <UIActionSheet.NumberCell>{1234567890}</UIActionSheet.NumberCell>
            <UIActionSheet.IconCell onPress={() => null} />
        </UIActionSheet.SecondaryColumn>
    </UIActionSheet.CustomAction>,

    <UIActionSheet.CustomAction>
        <UIActionSheet.PrimaryColumn onPress={() => null}>
            <UIActionSheet.IconCell />
            <UIActionSheet.ActionCell title="Action" />
        </UIActionSheet.PrimaryColumn>
        <UIActionSheet.SecondaryColumn>
            <UIActionSheet.IconCell onPress={() => null} />
            <UIActionSheet.IconCell onPress={() => null} />
        </UIActionSheet.SecondaryColumn>
    </UIActionSheet.CustomAction>,
];

const as = (
    <UIActionSheet visible note="A short description of the actions goes here.">
        {foregroundList}
        <UIActionSheet.Action
            type={UIActionSheet.Action.Type.Disabled}
            title="Disabled Action"
            onPress={() => null}
        />
        <UIActionSheet.Action
            type={UIActionSheet.Action.Type.Neutral}
            title="Neutral Action"
            onPress={() => null}
        />
        <UIActionSheet.Action
            type={UIActionSheet.Action.Type.Negative}
            title="Negative Action"
            onPress={() => null}
        />
        <UIActionSheet.Action
            type={UIActionSheet.Action.Type.Cancel}
            title="Cancel Action"
            onPress={() => null}
        />
    </UIActionSheet>
);
as;
