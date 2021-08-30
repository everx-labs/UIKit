import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
    useDerivedValue,
    withSpring,
    useAnimatedStyle,
    interpolate,
    useSharedValue,
    runOnJS,
    useWorkletCallback,
} from 'react-native-reanimated';
import { UIConstant } from '../../constants';
import { VisibilityState, DuplicateState } from '../constants';

const springConfig: Animated.WithSpringConfig = {
    overshootClamping: true,
    stiffness: 100,
};

export const useVisibilityState = (
    duplicateState: Animated.SharedValue<DuplicateState>,
    onAnimationEnd: (visibilityState: VisibilityState) => void,
) => {
    const runUIAnimationEndCallback = useWorkletCallback(
        (isFinished: boolean) => {
            if (isFinished) {
                if (duplicateState.value === DuplicateState.Closed) {
                    runOnJS(onAnimationEnd)(VisibilityState.Closed);
                }
                if (duplicateState.value === DuplicateState.Opened) {
                    runOnJS(onAnimationEnd)(VisibilityState.Opened);
                }
            }
        },
        [onAnimationEnd],
    );
    return useDerivedValue(() => {
        const toValue =
            duplicateState.value === DuplicateState.Opened
                ? VisibilityState.Opened
                : VisibilityState.Closed;
        return withSpring(toValue, springConfig, runUIAnimationEndCallback);
    }, []);
};

export const useAnimatedContainerStyle = (
    visibilityState: Readonly<Animated.SharedValue<number>>,
    pageY: Animated.SharedValue<number>,
    pageX: Animated.SharedValue<number>,
    width: Animated.SharedValue<number>,
    height: Animated.SharedValue<number>,
) => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const maxWidth = React.useMemo(() => windowWidth, [windowWidth]);
    const maxHeight = React.useMemo(() => windowHeight * 0.8, [windowHeight]);
    const fieldAspectRatio = React.useMemo(() => maxWidth / maxHeight, [maxWidth, maxHeight]);

    const openedImageScale = useDerivedValue(() => {
        const aspectRatio = width.value / height.value;
        if (aspectRatio > fieldAspectRatio) {
            return maxWidth && width.value ? maxWidth / width.value : 1;
        }
        return maxHeight && height.value ? maxHeight / height.value : 1;
    }, [maxWidth, maxHeight, fieldAspectRatio]);

    const centeredImageX = useDerivedValue(() => {
        return (
            (width.value * (openedImageScale.value - 1)) / 2 +
            (windowWidth - width.value * openedImageScale.value) / 2
        );
    }, [windowWidth]);

    const centeredImageY = useDerivedValue(() => {
        return (
            (height.value * (openedImageScale.value - 1)) / 2 +
            (windowHeight - height.value * openedImageScale.value) / 2
        );
    }, [windowHeight]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        visibilityState.value,
                        [VisibilityState.Closed, VisibilityState.Opened],
                        [pageX.value, centeredImageX.value],
                    ),
                },
                {
                    translateY: interpolate(
                        visibilityState.value,
                        [VisibilityState.Closed, VisibilityState.Opened],
                        [pageY.value, centeredImageY.value],
                    ),
                },
                {
                    scale: interpolate(
                        visibilityState.value,
                        [VisibilityState.Closed, VisibilityState.Opened],
                        [1, openedImageScale.value],
                    ),
                },
            ],
        };
    }, []);

    return {
        animatedContainerStyle,
        openedImageScale,
    };
};

export const useDuplicateState = (
    isFullSizeDisplayed: boolean,
    setIsFullSizeDisplayed: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const duplicateState = useSharedValue<DuplicateState>(DuplicateState.Initial);

    const onLayout = React.useCallback(() => {
        if (duplicateState.value === DuplicateState.Initial) {
            duplicateState.value = DuplicateState.Measurement;
        }
    }, [duplicateState]);

    const onPressClose = React.useCallback(() => {
        /**
         * First we hide the heavy FullSizeImage for performance needs
         */
        setIsFullSizeDisplayed(false);
    }, [setIsFullSizeDisplayed]);

    const onMeasureEnd = useWorkletCallback(() => {
        duplicateState.value = DuplicateState.Opened;
    });

    React.useEffect(() => {
        /**
         * We collapse the container only after we have removed the heavy fullSizeImage
         */
        if (!isFullSizeDisplayed && duplicateState.value === DuplicateState.Opened) {
            duplicateState.value = DuplicateState.Closed;
        }
    }, [isFullSizeDisplayed, duplicateState]);

    return {
        duplicateState,
        onPressClose,
        onMeasureEnd,
        onLayout,
    };
};

export const useOnAnimationEnd = (
    onClose: () => void,
    setIsFullSizeDisplayed: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    return React.useCallback(
        (state: VisibilityState) => {
            if (state === VisibilityState.Closed) {
                /**
                 * The real animation goes with a slight delay, relative to the change in values.
                 * The timeout is in order to give time for the animation of the image to complete.
                 * TODO investigate how to fix it
                 */
                setTimeout(() => {
                    onClose();
                }, UIConstant.lightbox.animationDisplayDelay);
            }
            if (state === VisibilityState.Opened) {
                /**
                 * The timeout is in order to give time for the animation of the image
                 * unfolding to end and after that the fullSizeImage render starts.
                 * This will allow not to interrupt the animation with a heavy render.
                 */
                setTimeout(() => {
                    setIsFullSizeDisplayed(true);
                }, UIConstant.lightbox.animationDisplayDelay);
            }
        },
        [onClose, setIsFullSizeDisplayed],
    );
};
