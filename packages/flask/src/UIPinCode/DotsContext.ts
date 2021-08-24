import * as React from 'react';
import type Animated from 'react-native-reanimated';

export const DotsContext = React.createContext<{
    activeDotIndex: Animated.SharedValue<number>;
    dotsValues: Animated.SharedValue<number>[];
    dotsAnims: Animated.SharedValue<number>[];
    dotsCount: number;
    disabled: boolean;
}>(
    // @ts-ignore
    {},
);
