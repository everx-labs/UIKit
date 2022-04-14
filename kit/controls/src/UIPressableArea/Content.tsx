import * as React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { usePressableContentNumericParameter } from '../Pressable';
import { defaultUIPressableAreaScaleParameters, pressableAreaWithSpringConfig } from './constants';
import type { UIPressableAreaProps } from './types';

export function Content({
    children,
    scaleParameters,
}: Pick<UIPressableAreaProps, 'children' | 'scaleParameters'>) {
    const scale = usePressableContentNumericParameter(
        {
            ...defaultUIPressableAreaScaleParameters,
            ...scaleParameters,
        },
        pressableAreaWithSpringConfig,
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: scale.value,
                },
            ],
        };
    });

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
