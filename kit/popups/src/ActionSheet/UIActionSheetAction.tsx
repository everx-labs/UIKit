import * as React from 'react';
import { UIActionSheetActionProps, UIActionSheetActionType } from './types';
import { UIForeground } from '../UIForeground';

export function UIActionSheetAction({ type, title, onPress, testID }: UIActionSheetActionProps) {
    if (type === UIActionSheetActionType.Cancel) {
        return (
            <UIForeground.Container key={title}>
                <UIForeground.PrimaryColumn>
                    <UIForeground.CancelCell testID={testID} onPress={onPress} title={title} />
                </UIForeground.PrimaryColumn>
            </UIForeground.Container>
        );
    }

    return (
        <UIForeground.Container key={title}>
            <UIForeground.PrimaryColumn>
                <UIForeground.ActionCell
                    testID={testID}
                    disabled={type === UIActionSheetActionType.Disabled}
                    negative={type === UIActionSheetActionType.Negative}
                    onPress={onPress}
                    title={title}
                />
            </UIForeground.PrimaryColumn>
        </UIForeground.Container>
    );
}
