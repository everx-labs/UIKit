import type { WithSpringConfig } from 'react-native-reanimated';
import type { LinearChartDimensions } from './types';

export const LINEAR_CHART_CONTENT_HORIZONTAL_OFFSET: number = 16;
export const LINEAR_CHART_STROKE_WIDTH: number = 2;
export const LINEAR_CHART_HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE: number = 65;
export const LINEAR_CHART_VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE: number = 24;

export const LINEAR_CHART_WITH_SPRING_CONFIG: WithSpringConfig = {
    damping: 100,
    stiffness: 200,
};

export const LINEAR_CHART_INITIAL_DIMENSIONS: LinearChartDimensions = {
    width: 0,
    height: 0,
};
