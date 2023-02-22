import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAnimatedMessageStyle } from './hooks';

type AnimatedContainerProps = {
    children: React.ReactNode;
};

export function AnimatedContainer({ children }: AnimatedContainerProps) {
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
        top: 0,
        left: 0,
    },
});
