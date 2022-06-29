import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { UIButtonGroupActionProps } from './types';
import { Pressable } from '../Pressable';
import { UIButtonGroupActionContent } from './UIButtonGroupActionContent';

export function UIButtonGroupAction(props: UIButtonGroupActionProps) {
    const { disabled, loading, onPress, onLongPress, testID } = props;
    return (
        <Pressable
            testID={testID}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.container}
        >
            <UIButtonGroupActionContent {...props} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
