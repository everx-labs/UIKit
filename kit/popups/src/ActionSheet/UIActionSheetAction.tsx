import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { UILabel, TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIActionSheetActionProps, UIActionSheetActionType } from './types';
import { UIForeground } from '../UIForeground';

export const UIActionSheetAction: React.FC<UIActionSheetActionProps> = ({
    type,
    title,
    onPress,
}: UIActionSheetActionProps) => {
    if (type === UIActionSheetActionType.Cancel) {
        return (
            <TouchableOpacity
                key={title}
                testID={`${title}_action_button`}
                onPress={onPress}
                style={styles.container}
            >
                <UILabel
                    role={TypographyVariants.Action}
                    color={ColorVariants.TextSecondary}
                    numberOfLines={3}
                >
                    {title}
                </UILabel>
            </TouchableOpacity>
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

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
});
