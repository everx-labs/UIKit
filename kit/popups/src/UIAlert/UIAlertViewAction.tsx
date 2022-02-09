import * as React from 'react';
import { UIAlertViewActionProps, UIAlertViewActionType } from './types';
import { UIForeground } from '../UIForeground';

export const UIAlertViewAction: React.FC<UIAlertViewActionProps> = ({
    type,
    title,
    onPress,
}: UIAlertViewActionProps) => {
    if (type === UIAlertViewActionType.Cancel) {
        return (
            <UIForeground.Container key={title}>
                <UIForeground.PrimaryColumn>
                    <UIForeground.CancelCell
                        testID={`${title}_cancel_button`}
                        onPress={onPress}
                        title={title}
                    />
                </UIForeground.PrimaryColumn>
            </UIForeground.Container>
        );
    }

    return (
        <UIForeground.Container key={title}>
            <UIForeground.PrimaryColumn>
                <UIForeground.ActionCell
                    testID={`${title}_action_button`}
                    negative={type === UIAlertViewActionType.Negative}
                    onPress={onPress}
                    title={title}
                />
            </UIForeground.PrimaryColumn>
        </UIForeground.Container>
    );
};
