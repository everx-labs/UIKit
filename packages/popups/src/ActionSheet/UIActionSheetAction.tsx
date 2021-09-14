import * as React from 'react';
import { View } from 'react-native';
import {
    UIBoxButton,
    UIBoxButtonType,
    UIBoxButtonVariant,
} from '@tonlabs/uikit.hydrogen';
import { UIActionSheetActionProps, UIActionSheetActionType } from './types';

const getActionVariant = (
    type: UIActionSheetActionType,
): UIBoxButtonVariant => {
    switch (type) {
        case UIActionSheetActionType.Negative:
            return UIBoxButtonVariant.Negative;
        case UIActionSheetActionType.Cancel:
        case UIActionSheetActionType.Neutral:
        case UIActionSheetActionType.Disabled:
        default:
            return UIBoxButtonVariant.Neutral;
    }
};

const getBoxButtonType = (type: UIActionSheetActionType): UIBoxButtonType => {
    switch (type) {
        case UIActionSheetActionType.Cancel:
            return UIBoxButtonType.Nulled;
        case UIActionSheetActionType.Negative:
        case UIActionSheetActionType.Neutral:
        case UIActionSheetActionType.Disabled:
        default:
            return UIBoxButtonType.Tertiary;
    }
};

export const UIActionSheetAction: React.FC<UIActionSheetActionProps> = ({
    type,
    title,
    onPress,
}: UIActionSheetActionProps) => {
    const variant: UIBoxButtonVariant = getActionVariant(type);
    const boxButtonType: UIBoxButtonType = getBoxButtonType(type);
    return (
        <View key={title}>
            <UIBoxButton
                testID={`${title}_action_button`}
                type={boxButtonType}
                variant={variant}
                disabled={type === 'Disabled'}
                title={title}
                onPress={onPress}
            />
        </View>
    );
};
