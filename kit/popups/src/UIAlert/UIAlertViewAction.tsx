import * as React from 'react';
import { UIAlertViewActionProps, UIAlertViewActionType } from './types';
import { UIForeground } from '../UIForeground';

export function UIAlertViewAction({ type, title, onPress, testID }: UIAlertViewActionProps) {
    if (type === UIAlertViewActionType.Cancel) {
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
                    negative={type === UIAlertViewActionType.Negative}
                    onPress={onPress}
                    title={title}
                />
            </UIForeground.PrimaryColumn>
        </UIForeground.Container>
    );
}
