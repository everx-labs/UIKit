import * as React from 'react';
import type { View } from 'react-native';
import type { UIBoxButtonProps } from './types';
import { Pressable } from '../Pressable';
import { BoxButtonContent } from './BoxButtonContent';

export const UIBoxButton = React.forwardRef<View, UIBoxButtonProps>(function UIBoxButton(
    props: UIBoxButtonProps,
    ref,
) {
    const { disabled, loading, onPress, testID, layout } = props;

    return (
        <Pressable
            ref={ref}
            testID={testID}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            style={layout}
        >
            <BoxButtonContent {...props} />
        </Pressable>
    );
});
