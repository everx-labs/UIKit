import Animated from 'react-native-reanimated';
import type {
    ControlPoints,
    Dimensions,
    Point,
    LabelData,
} from '../../../types';
import { getScaledData, getControlPoints } from '../utils';
import { useLabelCoordinates, useLabelText, useLabelStyles } from '.';
import { LINEAR_CHART_STROKE_WIDTH } from '../../../constants';

export const useLabelData = (
    dimensions: Animated.SharedValue<Dimensions>,
    data: Point[],
): LabelData => {
    const scaledData = Animated.useDerivedValue<Point[] | null>(() => {
        return getScaledData(data, dimensions.value);
    }, [data]);

    const controlPoints = Animated.useDerivedValue<ControlPoints | null>(() => {
        return getControlPoints(
            data,
            scaledData.value,
            LINEAR_CHART_STROKE_WIDTH,
        );
    }, [data]);

    const {
        minimumLabelXCoordinate,
        maximumLabelXCoordinate,
        startLabelYCoordinate,
        endLabelYCoordinate,
    } = useLabelCoordinates(dimensions, controlPoints);

    const {
        leftLabelContainerStyle,
        rightLabelContainerStyle,
        maximumLabelContainerStyle,
        maximumLabelStyle,
        minimumLabelContainerStyle,
        minimumLabelStyle,
    } = useLabelStyles(
        dimensions,
        controlPoints,
        minimumLabelXCoordinate,
        maximumLabelXCoordinate,
        startLabelYCoordinate,
        endLabelYCoordinate,
    );

    const { minimumValue, maximumValue } = useLabelText(controlPoints);

    return {
        leftLabelContainerStyle,
        rightLabelContainerStyle,
        maximumLabelContainerStyle,
        maximumLabelStyle,
        minimumLabelContainerStyle,
        minimumLabelStyle,
        maximumValue,
        minimumValue,
    };
};
