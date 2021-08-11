import * as React from 'react';
import Animated, {
    useDerivedValue,
    withSpring,
    useAnimatedStyle,
    interpolate,
    useSharedValue,
    runOnJS,
    measure,
    withTiming,
} from 'react-native-reanimated';
import type { Dimensions } from '../types';
import { VisibilityState } from '../constants';

export const useDimensions = (
    originalRef: React.RefObject<Animated.View>,
    visibilityState: Animated.SharedValue<VisibilityState>,
): Dimensions => {
    const width = useSharedValue<number>(0);
    const height = useSharedValue<number>(0);
    const pageX = useSharedValue<number>(0);
    const pageY = useSharedValue<number>(0);

    useDerivedValue(() => {
        try {
            if (visibilityState.value === VisibilityState.Measurement) {
                const measurements = measure(originalRef);
                /**
                 * There is an unknown problem when the `View`
                 * does not change its appearance if the value is assigned directly.
                 * This problem is not permanent, but it sometimes happens without clear logic.
                 * This hack allows to avoid this problem.
                 */
                width.value = withTiming(measurements.width, { duration: 10 });
                height.value = withTiming(measurements.height, {
                    duration: 10,
                });
                pageY.value = withTiming(measurements.pageY, { duration: 10 });
                pageX.value = withTiming(measurements.pageX, { duration: 10 });

                // eslint-disable-next-line no-param-reassign
                visibilityState.value = VisibilityState.Opened;
            }
        } catch (e) {
            console.log(e);
        }
    });

    return {
        width,
        height,
        pageX,
        pageY,
    };
};

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
