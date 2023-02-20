import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedHeight } from './hooks';

type AnimatedContainerProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export function AnimatedContainer({ children, style }: AnimatedContainerProps) {
    const { onChildrenLayout, animatedStyle } = useAnimatedHeight();
    return (
        <Animated.View style={[style, animatedStyle]}>
            <Animated.View onLayout={onChildrenLayout}>{children}</Animated.View>
        </Animated.View>
    );
}
