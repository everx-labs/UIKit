import { UILinkButton } from '@tonlabs/uikit.hydrogen';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ActionProps } from './types';

export const Action = ({ action }: ActionProps) => {
    if (!action) {
        return null;
    }
    const { title, onTap, variant } = action;
    return (
        <View style={styles.container}>
            <UILinkButton
                testID="uiNotice_action"
                variant={variant}
                title={title}
                onPress={onTap}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 8,
    },
});
