import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { UIMsgButtonProps } from './types';
import { Pressable } from '../Pressable';
import { MsgButtonContent } from './MsgButtonContent';

export const UIMsgButton = (props: UIMsgButtonProps) => {
    const { disabled, loading, onPress, testID, layout, type } = props;

    return (
        <Pressable
            testID={testID}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            style={[styles.container, layout]}
        >
            <MsgButtonContent {...props} key={`UIMsgButton-${type}`} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: '100%',
    },
});
