import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UIBoxButton, UIBoxButtonType, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import { UIAlertViewActionProps, UIAlertViewActionType } from './types';

const getActionVariant = (type: UIAlertViewActionType): UIBoxButtonVariant => {
    switch (type) {
        case UIAlertViewActionType.Negative:
            return UIBoxButtonVariant.Negative;
        case UIAlertViewActionType.Cancel:
        case UIAlertViewActionType.Neutral:
        default:
            return UIBoxButtonVariant.Neutral;
    }
};

const getBoxButtonType = (type: UIAlertViewActionType): UIBoxButtonType => {
    switch (type) {
        case UIAlertViewActionType.Cancel:
            return UIBoxButtonType.Nulled;
        case UIAlertViewActionType.Negative:
        case UIAlertViewActionType.Neutral:
        default:
            return UIBoxButtonType.Tertiary;
    }
};

export const UIAlertViewAction: React.FC<UIAlertViewActionProps> = ({
    type,
    title,
    onPress,
}: UIAlertViewActionProps) => {
    const variant: UIBoxButtonVariant = getActionVariant(type);
    const boxButtonType: UIBoxButtonType = getBoxButtonType(type);
    return (
        <View key={title} style={styles.action}>
            <UIBoxButton type={boxButtonType} variant={variant} title={title} onPress={onPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    action: {
        paddingTop: 16,
    },
});
