import type Animated from 'react-native-reanimated';
import type { Dimensions } from '../types';

export const CONTENT_HORIZONTAL_OFFSET: number = 16;
export const STROKE_WIDTH: number = 2;
export const HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE: number = 60;
export const VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE: number = 24;

export const WITH_SPRING_CONFIG: Animated.WithSpringConfig = {
    damping: 100,
    stiffness: 200,
};

export const INITIAL_DIMENSIONS: Dimensions = {
    width: 0,
    height: 0,
};
