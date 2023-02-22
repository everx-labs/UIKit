import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { UIPressableArea } from '@tonlabs/uikit.controls';

import type { InputMessageContainerProps } from './types';
import { AnimatedContainer } from './AnimatedContainer';

export function InputMessageContainer({
    children,
    onPress,
}: InputMessageContainerProps): JSX.Element {
    if (Platform.OS === 'web' && onPress) {
        return (
            <AnimatedContainer>
                <UIPressableArea onPress={onPress} style={styles.pressableContainer}>
                    {children}
                </UIPressableArea>
            </AnimatedContainer>
        );
    }

    return <AnimatedContainer>{children}</AnimatedContainer>;
}

const styles = StyleSheet.create({
    pressableContainer: {
        // To make the pressable area zooms relative to the center of the text
        alignSelf: 'flex-start',

        userSelect: 'none',
    },
});
