import { UIBoxButton, UIBoxButtonType } from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.navigation';
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
        paddingLeft: UIConstant.contentInsetVerticalX2,
    },
});
