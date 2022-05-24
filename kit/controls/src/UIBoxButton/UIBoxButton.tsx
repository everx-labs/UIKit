import * as React from 'react';
import type { UIBoxButtonProps } from './types';
import { Pressable } from '../Pressable';
import { BoxButtonContent } from './BoxButtonContent';

export function UIBoxButton(props: UIBoxButtonProps) {
    const { disabled, loading, onPress, testID, layout } = props;

    return (
        <Pressable
            testID={testID}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            style={layout}
        >
            <BoxButtonContent {...props} />
        </Pressable>
    );
}
