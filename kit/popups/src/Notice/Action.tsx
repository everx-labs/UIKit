import { UIBoxButton, UIBoxButtonType } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ActionProps } from './types';

export const Action = ({ action, variant }: ActionProps) => {
    if (!action) {
        return null;
    }
    const { title, onTap } = action;
    return (
        <View style={styles.container}>
            <UIBoxButton
                testID="uiNotice_action"
                type={UIBoxButtonType.Tertiary}
                variant={variant}
                title={title}
                onPress={onTap}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: UILayoutConstant.contentInsetVerticalX2,
    },
});
