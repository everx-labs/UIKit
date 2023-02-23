import type { LayoutChangeEvent } from 'react-native';
import {
    useSharedValue,
    useWorkletCallback,
    withSpring,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';

export function useAnimatedMessageStyle() {
    const animatedHeight = useSharedValue(0);
    const opacity = useSharedValue(0);
    const isFirstRender = useSharedValue(true);

    const onChildrenLayout = useWorkletCallback((event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        // The first render is not animated
        if (isFirstRender.value) {
            isFirstRender.value = false;
            animatedHeight.value = height;
            opacity.value = height > 0 ? 1 : 0;
            return;
        }

        animatedHeight.value = withSpring(height, {
            overshootClamping: true,
        });

        const newOpacity = height > 0 ? 1 : 0;
        opacity.value = withTiming(newOpacity, { easing: Easing.in(Easing.ease) });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: animatedHeight.value,
            opacity: opacity.value,
        };
    });

    return { onChildrenLayout, animatedStyle };
}
