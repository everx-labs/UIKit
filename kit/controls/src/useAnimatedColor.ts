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
    const animationValue = useSharedValue(0);
    const targetValue = useSharedValue(0);

    const previousColor = useSharedValue<string | number>(color);
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
