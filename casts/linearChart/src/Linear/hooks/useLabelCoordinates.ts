import Animated, { useAnimatedReaction, useSharedValue, withSpring } from 'react-native-reanimated';
import type {
    LinearChartAnimatedState,
    LinearChartDimensions,
    LinearChartControlPoints,
} from '../types';
import { LINEAR_CHART_WITH_SPRING_CONFIG } from '../constants';

const getIsNoAnimationNeeded = (
    currentAnimatedState: LinearChartAnimatedState,
    previousAnimatedState: LinearChartAnimatedState | null,
): boolean => {
    'worklet';

    if (!previousAnimatedState || !previousAnimatedState.controlPoints) {
        return true;
    }
    const isWidthChanged: boolean =
        currentAnimatedState.dimensions.width !== previousAnimatedState.dimensions.width;
    const isHeightChanged: boolean =
        currentAnimatedState.dimensions.height !== previousAnimatedState.dimensions.height;
    return isWidthChanged || isHeightChanged;
};

export const useLabelCoordinates = (
    dimensions: Animated.SharedValue<LinearChartDimensions>,
    controlPoints: Readonly<Animated.SharedValue<LinearChartControlPoints | null>>,
) => {
    const minimumLabelXCoordinate = useSharedValue<number>(0);
    const maximumLabelXCoordinate = useSharedValue<number>(0);
    const startLabelYCoordinate = useSharedValue<number>(0);
    const endLabelYCoordinate = useSharedValue<number>(0);

    useAnimatedReaction(
        () => {
            return {
                dimensions: dimensions.value,
                controlPoints: controlPoints.value,
            };
        },
        (
            currentAnimatedState: LinearChartAnimatedState,
            previousAnimatedState: LinearChartAnimatedState | null,
        ) => {
            if (currentAnimatedState.controlPoints === null) {
                return;
            }
            if (getIsNoAnimationNeeded(currentAnimatedState, previousAnimatedState)) {
                minimumLabelXCoordinate.value = currentAnimatedState.controlPoints.minimum.x;
                maximumLabelXCoordinate.value = currentAnimatedState.controlPoints.maximum.x;
                startLabelYCoordinate.value = currentAnimatedState.controlPoints.start.y;
                endLabelYCoordinate.value = currentAnimatedState.controlPoints.end.y;
            } else {
                minimumLabelXCoordinate.value = withSpring(
                    currentAnimatedState.controlPoints.minimum.x,
                    LINEAR_CHART_WITH_SPRING_CONFIG,
                );
                maximumLabelXCoordinate.value = withSpring(
                    currentAnimatedState.controlPoints.maximum.x,
                    LINEAR_CHART_WITH_SPRING_CONFIG,
                );
                startLabelYCoordinate.value = withSpring(
                    currentAnimatedState.controlPoints.start.y,
                    LINEAR_CHART_WITH_SPRING_CONFIG,
                );
                endLabelYCoordinate.value = withSpring(
                    currentAnimatedState.controlPoints.end.y,
                    LINEAR_CHART_WITH_SPRING_CONFIG,
                );
            }
        },
        [controlPoints.value, dimensions.value],
    );

    return {
        minimumLabelXCoordinate,
        maximumLabelXCoordinate,
        startLabelYCoordinate,
        endLabelYCoordinate,
    };
};
