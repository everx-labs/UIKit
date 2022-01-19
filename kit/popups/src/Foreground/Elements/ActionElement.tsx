import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIForegroundActionProps } from '../types';
import { usePressableElementColorByPartStatus, useMergedPartStatus } from '../hooks';
import { PartStatusContext } from '../Container';

export function ActionElement({ title, onPress, disabled, negative }: UIForegroundActionProps) {
    const partStatus = React.useContext(PartStatusContext);

    const mergedPartStatus = useMergedPartStatus(partStatus, disabled, negative, onPress);
    const actionColor = usePressableElementColorByPartStatus(mergedPartStatus);

    return (
        <TouchableOpacity
            testID={`${title}_action_button`}
            disabled={partStatus.partState === 'Pressable' || !onPress || disabled}
            onPress={onPress}
            style={[
                styles.container,
                partStatus.partType === 'Primary'
                    ? styles.primaryContainer
                    : styles.secondaryContainer,
            ]}
        >
            <UILabel
                role={TypographyVariants.Action}
                color={actionColor}
                numberOfLines={3}
                style={
                    partStatus.partType === 'Primary' ? styles.primaryText : styles.secondaryText
                }
            >
                {title}
            </UILabel>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingHorizontal: UILayoutConstant.contentInsetVerticalX3 / 2,
    },
    primaryContainer: {
        flex: 1,
    },
    secondaryContainer: {
        flexShrink: 1,
    },
    primaryText: {},
    secondaryText: {
        textAlign: 'right',
    },
});
