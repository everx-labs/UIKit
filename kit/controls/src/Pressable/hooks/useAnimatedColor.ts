import Animated, { useDerivedValue, withSpring, WithSpringConfig } from 'react-native-reanimated';

/**
 * This function returns an animated color value that changes as spring.
 * @param color
 * @param withSpringConfig
 * @returns animated color value
 */
export function useAnimatedColor(
    targetColor: Readonly<Animated.SharedValue<string>>,
    withSpringConfig: WithSpringConfig,
) {
    return useDerivedValue(() => {
        return withSpring(targetColor.value, withSpringConfig);
    });
}
