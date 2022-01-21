import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { UILabel, TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIActionSheetActionProps, UIActionSheetActionType } from './types';

const getColor = (type: UIActionSheetActionType): ColorVariants => {
    switch (type) {
        case UIActionSheetActionType.Negative:
            return ColorVariants.TextNegative;
        case UIActionSheetActionType.Cancel:
            return ColorVariants.TextSecondary;
        case UIActionSheetActionType.Disabled:
            return ColorVariants.TextTertiary;
        case UIActionSheetActionType.Neutral:
        default:
            return ColorVariants.TextPrimary;
    }
};

export const UIActionSheetAction: React.FC<UIActionSheetActionProps> = ({
    type,
    title,
    onPress,
}: UIActionSheetActionProps) => {
    const color = getColor(type);

    return (
        <TouchableOpacity
            key={title}
            testID={`${title}_action_button`}
            disabled={type === 'Disabled'}
            onPress={onPress}
            style={styles.container}
        >
            <UILabel role={TypographyVariants.Action} color={color} numberOfLines={3}>
                {title}
            </UILabel>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
});
