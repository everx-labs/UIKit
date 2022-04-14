import type { WithSpringConfig } from 'react-native-reanimated';
import type { UIPressableAreaScaleParameters } from './types';

export const defaultUIPressableAreaScaleParameters: UIPressableAreaScaleParameters = {
    initial: 1,
    pressed: 0.95,
    hovered: 1.02,
};

export const pressableAreaWithSpringConfig: WithSpringConfig = {
    stiffness: 200,
    overshootClamping: true,
};
