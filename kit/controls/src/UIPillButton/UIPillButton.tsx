import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { UIPillButtonProps } from './types';
import { Pressable } from '../Pressable';
import { PillButtonContent } from './PillButtonContent';

export function UIPillButton(props: UIPillButtonProps) {
    const { disabled, loading, onPress, testID, layout } = props;

    return (
        <Pressable
            testID={testID}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            style={[styles.container, layout]}
        >
            <PillButtonContent {...props} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: '100%',
    },
});
