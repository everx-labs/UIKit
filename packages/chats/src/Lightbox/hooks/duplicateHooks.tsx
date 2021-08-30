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
import type { VisibilityState, DuplicateState } from '../constants';

// @inline
const DUPLICATE_STATE_INITIAL: DuplicateState = 0;
// @inline
const DUPLICATE_STATE_MEASUREMENT: DuplicateState = 1;
// @inline
const DUPLICATE_STATE_OPENED: DuplicateState = 2;
// @inline
const DUPLICATE_STATE_CLOSED: DuplicateState = 3;

// @inline
const VISIBILITY_STATE_CLOSED: VisibilityState = 0;
// @inline
const VISIBILITY_STATE_OPENED: VisibilityState = 1;

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
                if (duplicateState.value === DUPLICATE_STATE_CLOSED) {
                    runOnJS(onAnimationEnd)(VISIBILITY_STATE_CLOSED);
                }
                if (duplicateState.value === DUPLICATE_STATE_OPENED) {
                    runOnJS(onAnimationEnd)(VISIBILITY_STATE_OPENED);
                }
            }
        },
        [onAnimationEnd],
    );
    return useDerivedValue(() => {
        const toValue =
            duplicateState.value === DUPLICATE_STATE_OPENED
                ? VISIBILITY_STATE_OPENED
                : VISIBILITY_STATE_CLOSED;
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
                        [VISIBILITY_STATE_CLOSED, VISIBILITY_STATE_OPENED],
                        [pageX.value, centeredImageX.value],
                    ),
                },
                {
                    translateY: interpolate(
                        visibilityState.value,
                        [VISIBILITY_STATE_CLOSED, VISIBILITY_STATE_OPENED],
                        [pageY.value, centeredImageY.value],
                    ),
                },
                {
                    scale: interpolate(
                        visibilityState.value,
                        [VISIBILITY_STATE_CLOSED, VISIBILITY_STATE_OPENED],
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
    const duplicateState = useSharedValue<DuplicateState>(DUPLICATE_STATE_INITIAL);

    const onLayout = React.useCallback(() => {
        if (duplicateState.value === DUPLICATE_STATE_INITIAL) {
            duplicateState.value = DUPLICATE_STATE_MEASUREMENT;
        }
    }, [duplicateState]);

    const onPressClose = React.useCallback(() => {
        /**
         * First we hide the heavy FullSizeImage for performance needs
         */
        setIsFullSizeDisplayed(false);
    }, [setIsFullSizeDisplayed]);

    const onMeasureEnd = useWorkletCallback(() => {
        duplicateState.value = DUPLICATE_STATE_OPENED;
    });

    React.useEffect(() => {
        /**
         * We collapse the container only after we have removed the heavy fullSizeImage
         */
        if (!isFullSizeDisplayed && duplicateState.value === DUPLICATE_STATE_OPENED) {
            duplicateState.value = DUPLICATE_STATE_CLOSED;
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
            if (state === VISIBILITY_STATE_CLOSED) {
                /**
                 * The real animation goes with a slight delay, relative to the change in values.
                 * The timeout is in order to give time for the animation of the image to complete.
                 * TODO investigate how to fix it
                 */
                setTimeout(() => {
                    onClose();
                }, UIConstant.lightbox.animationDisplayDelay);
            }
            if (state === VISIBILITY_STATE_OPENED) {
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
