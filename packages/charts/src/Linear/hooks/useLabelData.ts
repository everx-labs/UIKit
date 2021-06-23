import Animated from 'react-native-reanimated';
import type {
    LinearChartDimensions,
    LinearChartPoint,
    LinearChartLabelData,
    LinearChartControlPoints,
} from '../../types';
import { getScaledData, getControlPoints } from '../utils';
import { useLabelCoordinates } from './useLabelCoordinates';
import { useLabelText } from './useLabelText';
import { useLabelStyles } from './useLabelStyles';
import { LINEAR_CHART_STROKE_WIDTH } from '../../constants';

export const useLabelData = (
    dimensions: Animated.SharedValue<LinearChartDimensions>,
    data: LinearChartPoint[],
): LinearChartLabelData => {
    const scaledData = Animated.useDerivedValue<
        LinearChartPoint[] | null
    >(() => {
        return getScaledData(data, dimensions.value);
    }, [data]);

    const controlPoints = Animated.useDerivedValue<LinearChartControlPoints | null>(() => {
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
