import * as React from 'react';
import type { View } from 'react-native';

import { Pressable } from '../Pressable';
import type { UIActionButtonProps } from './types';
import { ActionButtonContent } from './ActionButtonContent';

export const UIActionButton = React.forwardRef<View, UIActionButtonProps>(function UIActionButton(
    props: UIActionButtonProps,
    ref,
) {
    const { disabled, loading, onPress, testID } = props;

    return (
        <Pressable
            ref={ref}
            testID={testID}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
        >
            <ActionButtonContent {...props} />
        </Pressable>
    );
});
