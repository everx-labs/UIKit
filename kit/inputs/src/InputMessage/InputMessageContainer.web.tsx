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
        return <AnimatedContainer style={styles.container}>{children}</AnimatedContainer>;
    }

    return (
        <UIPressableArea
            onPress={onPress}
            style={[styles.container, styles.pressableContainer, styles.unSelectableText]}
        >
            <AnimatedContainer>{children}</AnimatedContainer>
        </UIPressableArea>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    pressableContainer: {
        // To make the pressable area zoom relative to the center of the text
        alignSelf: 'flex-start',
    },
    unSelectableText: {
        display: 'flex',
        userSelect: 'none',
    },
});
