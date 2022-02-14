import * as React from 'react';
import { UIMenuActionProps, UIMenuActionType } from './types';
import { UIForeground } from '../UIForeground';

export const UIMenuAction: React.FC<UIMenuActionProps> = ({
    type,
    title,
    onPress,
}: UIMenuActionProps) => {
    return (
        <UIForeground.Container key={title}>
            <UIForeground.PrimaryColumn>
                <UIForeground.ActionCell
                    testID={`${title}_action_button`}
                    disabled={type === UIMenuActionType.Disabled}
                    negative={type === UIMenuActionType.Negative}
                    onPress={onPress}
                    title={title}
                />
            </UIForeground.PrimaryColumn>
        </UIForeground.Container>
    );
};
