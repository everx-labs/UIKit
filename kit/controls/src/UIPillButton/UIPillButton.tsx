import * as React from 'react';
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
            style={layout}
        >
            <PillButtonContent {...props} />
        </Pressable>
    );
}
