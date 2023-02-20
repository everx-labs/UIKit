import * as React from 'react';
import { StyleSheet } from 'react-native';

import { UIPressableArea } from '@tonlabs/uikit.controls';
import type { InputMessageContainerProps } from './types';
import { AnimatedContainer } from './AnimatedContainer';

export function InputMessageContainer({
    children,
    onPress,
    style,
}: InputMessageContainerProps): JSX.Element {
    if (!onPress) {
        return <AnimatedContainer style={[styles.container, style]}>{children}</AnimatedContainer>;
    }

    return (
        <UIPressableArea
            onPress={onPress}
            style={[styles.container, styles.unSelectableText, style]}
        >
            <AnimatedContainer style={[styles.container, style]}>{children}</AnimatedContainer>
        </UIPressableArea>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    unSelectableText: {
        display: 'flex',
        userSelect: 'none',
    },
});
