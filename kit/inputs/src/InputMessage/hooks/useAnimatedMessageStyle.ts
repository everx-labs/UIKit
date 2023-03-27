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
        const newOpacity = height > 0 ? 1 : 0;

        // The first render is not animated
        if (isFirstRender.value) {
            isFirstRender.value = false;
            animatedHeight.value = withTiming(height, { duration: 0 });
            opacity.value = withTiming(newOpacity, { duration: 0 });
            return;
        }

        if (animatedHeight.value !== height) {
            animatedHeight.value = withSpring(height, {
                overshootClamping: true,
            });
        }

        if (opacity.value !== newOpacity) {
            opacity.value = withTiming(newOpacity, { easing: Easing.in(Easing.ease) });
        }
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: animatedHeight.value,
            opacity: opacity.value,
        };
    });

    return { onChildrenLayout, animatedStyle };
}
