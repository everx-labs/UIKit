import * as React from 'react';
import type Animated from 'react-native-reanimated';

export const DotsContext = React.createContext<{
    activeDotIndex: Animated.SharedValue<number>;
    dotsValues: { current: Animated.SharedValue<number>[] };
    dotsAnims: { current: Animated.SharedValue<number>[] };
    dotsCount: number;
    disabled: boolean;
}>(
    // @ts-ignore
    {},
);
