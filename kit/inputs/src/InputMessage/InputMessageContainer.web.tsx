import * as React from 'react';
import { StyleSheet } from 'react-native';

import { UIPressableArea } from '@tonlabs/uikit.controls';

import type { InputMessageContainerProps } from './types';
import { AnimatedContainer } from './AnimatedContainer';

export function InputMessageContainer({
    children,
    onPress,
}: InputMessageContainerProps): JSX.Element {
    if (!onPress) {
        return <AnimatedContainer>{children}</AnimatedContainer>;
    }

    return (
        <UIPressableArea onPress={onPress} style={styles.pressableContainer}>
            <AnimatedContainer>{children}</AnimatedContainer>
        </UIPressableArea>
    );
}

const styles = StyleSheet.create({
    pressableContainer: {
        // To make the pressable area zooms relative to the center of the text
        alignSelf: 'flex-start',

        userSelect: 'none',
    },
});
