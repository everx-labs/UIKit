import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAnimatedMessageStyle } from './hooks';
import type { InputMessageAnimatedContainerProps } from './types';

export function AnimatedContainer({ children }: InputMessageAnimatedContainerProps) {
    const { onChildrenLayout, animatedStyle } = useAnimatedMessageStyle();
    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Animated.View style={styles.content} onLayout={onChildrenLayout}>
                {children}
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignSelf: 'stretch',
    },
    content: {
        position: 'absolute',
    },
});
