import * as React from 'react';
import Animated, {
    useDerivedValue,
    withSpring,
    useAnimatedStyle,
    interpolate,
    useSharedValue,
    runOnJS,
} from 'react-native-reanimated';
import { VisibilityState } from '../constants';

export const useScaleStyle = (
    visibilityState: Animated.SharedValue<VisibilityState>,
    onClose: () => void,
) => {
    const animationProgress = useDerivedValue(() => {
        const callback = (isFinished: boolean) => {
            if (
                isFinished &&
                visibilityState.value === VisibilityState.Closed
            ) {
                runOnJS(onClose)();
            }
        };
        const toValue =
            visibilityState.value === VisibilityState.Opened ? 1 : 0;
        return withSpring(
            toValue,
            {
                overshootClamping: true,
            },
            callback,
        );
    });

    const scaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(animationProgress.value, [0, 1], [1, 2]),
                },
            ],
        };
    });

    return {
        scaleStyle,
    };
};

export const useVisibilityState = () => {
    const visibilityState = useSharedValue<VisibilityState>(
        VisibilityState.Closed,
    );

    React.useEffect(() => {
        visibilityState.value = VisibilityState.Measurement;
    }, [visibilityState]);

    const onPressUnderlay = React.useCallback(() => {
        visibilityState.value = VisibilityState.Closed;
    }, [visibilityState]);

    return {
        visibilityState,
        onPressUnderlay,
    };
};
