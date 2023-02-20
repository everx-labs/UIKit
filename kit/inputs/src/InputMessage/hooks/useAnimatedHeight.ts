import type { LayoutChangeEvent } from 'react-native';
import {
    useSharedValue,
    useWorkletCallback,
    withSpring,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';

export function useAnimatedHeight() {
    const animatedHeight = useSharedValue(0);

    const onChildrenLayout = useWorkletCallback((event: LayoutChangeEvent) => {
        animatedHeight.value = withSpring(event.nativeEvent.layout.height, {
            overshootClamping: true,
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: animatedHeight.value,
            opacity: withTiming(animatedHeight.value > 0 ? 1 : 0, {
                easing: Easing.in(Easing.ease),
            }),
        };
    });

    return { onChildrenLayout, animatedStyle };
}
