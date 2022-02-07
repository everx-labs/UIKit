import * as React from 'react';
import { UIActionSheetActionProps, UIActionSheetActionType } from './types';
import { UIForeground } from '../UIForeground';

export const UIActionSheetAction: React.FC<UIActionSheetActionProps> = ({
    type,
    title,
    onPress,
}: UIActionSheetActionProps) => {
    if (type === UIActionSheetActionType.Cancel) {
        return (
            <UIForeground.Container key={title}>
                <UIForeground.PrimaryColumn>
                    <UIForeground.CancelCell
                        testID={`${title}_action_button`}
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
                    disabled={type === UIActionSheetActionType.Disabled}
                    negative={type === UIActionSheetActionType.Negative}
                    onPress={onPress}
                    title={title}
                />
            </UIForeground.PrimaryColumn>
        </UIForeground.Container>
    );
};
