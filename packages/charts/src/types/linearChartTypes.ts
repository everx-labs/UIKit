import type { ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';

export type LinearChartDimensions = {
    width: number;
    height: number;
};

export type LinearChartAnimatedState = {
    dimensions: LinearChartDimensions;
    controlPoints: LinearChartControlPoints | null;
};

export type LinearChartLabelData = {
    leftLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    rightLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    minimumLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    minimumLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
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
