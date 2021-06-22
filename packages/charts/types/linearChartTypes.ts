import type { ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';

export type Dimensions = {
    width: number;
    height: number;
};

export type AnimatedState = {
    dimensions: Dimensions;
    controlPoints: ControlPoints | null;
};

export type LabelData = {
    leftLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    rightLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    minimumLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    minimumLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumValue: string;
    minimumValue: string;
};

export type Point = {
    x: number;
    y: number;
};

export type ControlPoint = {
    value: number;
    x: number;
    y: number;
};
export type ControlPoints = {
    start: ControlPoint;
    end: ControlPoint;
    minimum: ControlPoint;
    maximum: ControlPoint;
};

export type Extremum = {
    minimumPoint: Point;
    minimumScaledPoint: Point;
    maximumPoint: Point;
    maximumScaledPoint: Point;
};
