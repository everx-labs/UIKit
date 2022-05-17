import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { UILinkButtonProps } from './types';
import { Pressable } from '../Pressable';
import { UILinkButtonContent } from './UILinkButtonContent';

export function UILinkButton(props: UILinkButtonProps) {
    const { disabled, loading, onPress, testID, layout } = props;
    return (
        <Pressable
            testID={testID}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            style={[styles.container, layout]}
        >
            <UILinkButtonContent {...props} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: '100%',
    },
});
