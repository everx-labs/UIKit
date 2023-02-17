import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIPressableArea } from '@tonlabs/uikit.controls';
import type { InputMessageContainerProps } from './types';

export function InputMessageContainer({
    children,
    onPress,
    style,
}: InputMessageContainerProps): JSX.Element {
    if (!onPress) {
        return <View style={style}>{children}</View>;
    }
    return (
        <UIPressableArea onPress={onPress} style={[styles.unSelectableText, style]}>
            {children}
        </UIPressableArea>
    );
}

const styles = StyleSheet.create({
    unSelectableText: {
        display: 'flex',
        userSelect: 'none',
    },
});
