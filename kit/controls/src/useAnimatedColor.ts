import * as React from 'react';
import {
    useDerivedValue,
    withSpring,
    interpolateColor,
    useSharedValue,
    WithSpringConfig,
} from 'react-native-reanimated';

/**
 * This function returns an animated color value that changes as spring.
 * @param color
 * @param withSpringConfig
 * @returns animated color value
 */
export function useAnimatedColor(color: string, withSpringConfig: WithSpringConfig) {
    /**
     * The value that is animated changes from the current value
     * to the `targetValue` when the color changes.
     */
    const animationValue = useSharedValue(0);
    /**
     * It can only be 0 or 1. It reverses the value when the color changes.
     */
    const targetValue = useSharedValue(0);

    /**
     * Previous color value
     */
    const previousColor = useSharedValue<string | number>(color);
    /**
     * Next color value
     */
    const targetColor = useSharedValue<string>(color);

    const animatedColor = useDerivedValue(() => {
        return interpolateColor(
            animationValue.value,
            [1 - targetValue.value, targetValue.value],
            [previousColor.value, targetColor.value],
        );
    });

    React.useEffect(
        function onColorChange() {
            if (targetColor.value === color) {
                return;
            }
            const newTargetValue = 1 - targetValue.value;
            targetValue.value = newTargetValue;
            targetColor.value = color;

            animationValue.value = withSpring(
                newTargetValue,
                withSpringConfig,
                function onSpringAnimationEnd() {
                    previousColor.value = animatedColor.value;
                },
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [color],
    );

    return animatedColor;
}
