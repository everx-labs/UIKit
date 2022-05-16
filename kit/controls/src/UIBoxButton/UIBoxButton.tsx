import * as React from 'react';
import type { UIBoxButtonProps } from './types';
import { Pressable } from '../Pressable';
import { BoxButtonContent } from './BoxButtonContent';

export function UIBoxButton(props: UIBoxButtonProps) {
    const { disabled, loading, onPress, testID } = props;

    return (
        <Pressable testID={testID} disabled={disabled} loading={loading} onPress={onPress}>
            <BoxButtonContent {...props} />
        </Pressable>
    );
}
