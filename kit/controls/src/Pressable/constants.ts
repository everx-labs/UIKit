import * as React from 'react';
import type Animated from 'react-native-reanimated';
import type { WithSpringConfig } from 'react-native-reanimated';
import type { PressableStateType } from './types';

export const PressableStateContext = React.createContext<Readonly<
    Animated.SharedValue<PressableStateType>
> | null>(null);

export const pressableWithSpringConfig: WithSpringConfig = {
    stiffness: 1000,
    overshootClamping: true,
};

export const maxPressDistance = 10;
