import * as React from 'react';
import type { WithSpringConfig } from 'react-native-reanimated';

export enum PressableStateVariant {
    Initial = 'Initial',
    Disabled = 'Disabled',
    Hovered = 'Hovered',
    Pressed = 'Pressed',
}

export const PressableStateContext = React.createContext<PressableStateVariant>(
    PressableStateVariant.Initial,
);

export const pressableWithSpringConfig: WithSpringConfig = {
    stiffness: 1000,
    overshootClamping: true,
};
