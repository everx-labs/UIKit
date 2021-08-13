import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
    useDerivedValue,
    withSpring,
    useAnimatedStyle,
    interpolate,
    useSharedValue,
    runOnJS,
} from 'react-native-reanimated';
import { AnimationProgress, VisibilityState } from '../constants';

export const useAnimationProgress = (
    visibilityState: Animated.SharedValue<VisibilityState>,
    onClose: () => void,
) => {
    return useDerivedValue(() => {
        const callback = (isFinished: boolean) => {
            if (isFinished && visibilityState.value === VisibilityState.Closed) {
                runOnJS(onClose)();
            }
        };
        const toValue =
            visibilityState.value === VisibilityState.Opened
                ? AnimationProgress.Opened
                : AnimationProgress.Closed;
        return withSpring(
            toValue,
            {
                overshootClamping: true,
            },
            callback,
        );
    });
};

export const useAnimatedContainerStyle = (
    animationProgress: Readonly<Animated.SharedValue<number>>,
    pageY: Animated.SharedValue<number>,
    pageX: Animated.SharedValue<number>,
    width: Animated.SharedValue<number>,
    height: Animated.SharedValue<number>,
) => {
    const windowDimensions = useWindowDimensions();
    const maxWidth = React.useMemo(() => windowDimensions.width, [windowDimensions.width]);
    const maxHeight = React.useMemo(() => windowDimensions.height * 0.8, [windowDimensions.height]);
    const fieldAspectRatio = React.useMemo(() => maxWidth / maxHeight, [maxWidth, maxHeight]);

    const centeredImageX = useDerivedValue(() => {
        return (windowDimensions.width - width.value) / 2;
    }, [windowDimensions.width]);

    const centeredImageY = useDerivedValue(() => {
        return (windowDimensions.height - height.value) / 2;
    }, [windowDimensions.height]);

    const openedImageScale = useDerivedValue(() => {
        const aspectRatio = width.value / height.value;
        if (aspectRatio > fieldAspectRatio) {
            return maxWidth && width.value ? maxWidth / width.value : 1;
        }
        return maxHeight && height.value ? maxHeight / height.value : 1;
    }, [maxWidth, maxHeight, fieldAspectRatio]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        animationProgress.value,
                        [AnimationProgress.Closed, AnimationProgress.Opened],
                        [pageX.value, centeredImageX.value],
                    ),
                },
                {
                    translateY: interpolate(
                        animationProgress.value,
                        [AnimationProgress.Closed, AnimationProgress.Opened],
                        [pageY.value, centeredImageY.value],
                    ),
                },
                {
                    scale: interpolate(
                        animationProgress.value,
                        [AnimationProgress.Closed, AnimationProgress.Opened],
                        [1, openedImageScale.value],
                    ),
                },
            ],
        };
    });

    return animatedContainerStyle;
};

export const useVisibilityState = () => {
    const visibilityState = useSharedValue<VisibilityState>(VisibilityState.Closed);

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
