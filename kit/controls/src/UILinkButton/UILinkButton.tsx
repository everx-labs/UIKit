import * as React from 'react';
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
            style={layout}
        >
            <UILinkButtonContent {...props} />
        </Pressable>
    );
}
