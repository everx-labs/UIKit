import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAnimatedHeight } from './hooks';

type AnimatedContainerProps = {
    children: React.ReactNode;
};

export function AnimatedContainer({ children }: AnimatedContainerProps) {
    const { onChildrenLayout, animatedStyle } = useAnimatedHeight();

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Animated.View onLayout={onChildrenLayout}>{children}</Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});
