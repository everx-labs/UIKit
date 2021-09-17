import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { LinearChartDimensions, LinearChartControlPoints } from '../../types';

export const useLabelStyles = (
    dimensions: Animated.SharedValue<LinearChartDimensions>,
    controlPoints: Readonly<Animated.SharedValue<LinearChartControlPoints | null>>,
    minimumLabelXCoordinate: Animated.SharedValue<number>,
    maximumLabelXCoordinate: Animated.SharedValue<number>,
    startLabelYCoordinate: Animated.SharedValue<number>,
    endLabelYCoordinate: Animated.SharedValue<number>,
) => {
    const leftLabelContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: startLabelYCoordinate.value,
                },
            ],
        };
    });

    const rightLabelContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: endLabelYCoordinate.value,
                },
            ],
        };
    });

    const maximumLabelContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: maximumLabelXCoordinate.value,
                },
            ],
        };
    });
    const maximumLabelStyle = useAnimatedStyle(() => {
        return {
            opacity:
                !controlPoints.value ||
                controlPoints.value.maximum.x <= 0 ||
                controlPoints.value.maximum.x >= dimensions.value.width
                    ? 0
                    : 1,
        };
    });

    const minimumLabelContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: minimumLabelXCoordinate.value,
                },
            ],
        };
    });
    const minimumLabelStyle = useAnimatedStyle(() => {
        return {
            opacity:
                minimumLabelXCoordinate.value === null ||
                !controlPoints.value ||
                controlPoints.value.minimum.x <= 0 ||
                controlPoints.value.minimum.x >= dimensions.value.width
                    ? 0
                    : 1,
        };
    });
    return {
        leftLabelContainerStyle,
        rightLabelContainerStyle,
        maximumLabelContainerStyle,
        maximumLabelStyle,
        minimumLabelContainerStyle,
        minimumLabelStyle,
    };
};
