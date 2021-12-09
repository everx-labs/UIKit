import type { ViewStyle } from 'react-native';
import type { AnimatedStyleProp } from 'react-native-reanimated';

export type LinearChartDimensions = {
    width: number;
    height: number;
};

export type LinearChartAnimatedState = {
    dimensions: LinearChartDimensions;
    controlPoints: LinearChartControlPoints | null;
};

export type LinearChartLabelData = {
    leftLabelContainerStyle: AnimatedStyleProp<ViewStyle>;
    rightLabelContainerStyle: AnimatedStyleProp<ViewStyle>;
    maximumLabelContainerStyle: AnimatedStyleProp<ViewStyle>;
    maximumLabelStyle: AnimatedStyleProp<ViewStyle>;
    minimumLabelContainerStyle: AnimatedStyleProp<ViewStyle>;
    minimumLabelStyle: AnimatedStyleProp<ViewStyle>;
    maximumValue: number | null;
    minimumValue: number | null;
};

export type LinearChartPoint = {
    x: number;
    y: number;
};

export type LinearChartControlPoint = {
    value: number;
    x: number;
    y: number;
};
export type LinearChartControlPoints = {
    start: LinearChartControlPoint;
    end: LinearChartControlPoint;
    minimum: LinearChartControlPoint;
    maximum: LinearChartControlPoint;
};

export type LinearChartExtremum = {
    minimumPoint: LinearChartPoint;
    minimumScaledPoint: LinearChartPoint;
    maximumPoint: LinearChartPoint;
    maximumScaledPoint: LinearChartPoint;
};
