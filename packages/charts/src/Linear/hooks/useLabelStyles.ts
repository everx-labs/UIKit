import Animated from 'react-native-reanimated';
import type { ControlPoints, Dimensions } from '../../../types';

export const useLabelStyles = (
    dimensions: Animated.SharedValue<Dimensions>,
    controlPoints: Readonly<Animated.SharedValue<ControlPoints | null>>,
    minimumLabelXCoordinate: Animated.SharedValue<number>,
    maximumLabelXCoordinate: Animated.SharedValue<number>,
    startLabelYCoordinate: Animated.SharedValue<number>,
    endLabelYCoordinate: Animated.SharedValue<number>,
) => {
    const leftLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: startLabelYCoordinate.value,
                },
            ],
        };
    });

    const rightLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: endLabelYCoordinate.value,
                },
            ],
        };
    });

    const maximumLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: maximumLabelXCoordinate.value,
                },
            ],
        };
    });
    const maximumLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity:
                !controlPoints.value ||
                controlPoints.value.maximum.x <= 0 ||
                controlPoints.value.maximum.x >= dimensions.value.width
                    ? 0
                    : 1,
        };
    });

    const minimumLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: minimumLabelXCoordinate.value,
                },
            ],
        };
    });
    const minimumLabelStyle = Animated.useAnimatedStyle(() => {
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
