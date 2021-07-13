import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
    UIBoxButton,
    UIBoxButtonType,
    UIBoxButtonVariant,
} from '@tonlabs/uikit.hydrogen';
import type {
    UIAlertViewActionProps,
    UIAlertViewActionType,
} from '../UIAlertView';

const getActionVariant = (type: UIAlertViewActionType): UIBoxButtonVariant => {
    switch (type) {
        case 'Negative':
            return UIBoxButtonVariant.Negative;
        case 'Neutral':
        default:
            return UIBoxButtonVariant.Neutral;
    }
};

export const UIAlertViewAction: React.FC<UIAlertViewActionProps> = ({
    type,
    title,
    onPress,
}: UIAlertViewActionProps) => {
    const variant: UIBoxButtonVariant = getActionVariant(type);
    return (
        <View key={title} style={styles.action}>
            <UIBoxButton
                type={UIBoxButtonType.Tertiary}
                variant={variant}
                title={title}
                onPress={onPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    action: {
        paddingTop: 16,
    },
});
