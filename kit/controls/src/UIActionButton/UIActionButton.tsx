import * as React from 'react';

import { Pressable } from '../Pressable';
import type { UIActionButtonProps } from './types';
import { ActionButtonContent } from './ActionButtonContent';

export function UIActionButton(props: UIActionButtonProps) {
    const { disabled, loading, onPress, testID, layout } = props;

    return (
        <Pressable
            testID={testID}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            style={layout}
        >
            <ActionButtonContent {...props} />
        </Pressable>
    );
}
