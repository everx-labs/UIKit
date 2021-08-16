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
import { VisibilityState, DuplicateContentState } from '../constants';

export const useVisibilityState = (
    duplicateContentState: Animated.SharedValue<DuplicateContentState>,
    onAnimationEnd: (visibilityState: VisibilityState) => void,
) => {
    const runUIAnimationEndCallback = useWorkletCallback(
        (isFinished: boolean) => {
            if (isFinished) {
                if (duplicateContentState.value === DuplicateContentState.Closed) {
                    runOnJS(onAnimationEnd)(VisibilityState.Closed);
                }
                if (duplicateContentState.value === DuplicateContentState.Opened) {
                    runOnJS(onAnimationEnd)(VisibilityState.Opened);
                }
            }
        },
        [onAnimationEnd],
    );
    return useDerivedValue(() => {
        const toValue =
            duplicateContentState.value === DuplicateContentState.Opened
                ? VisibilityState.Opened
                : VisibilityState.Closed;
        return withSpring(
            toValue,
            {
                overshootClamping: true,
            },
            runUIAnimationEndCallback,
        );
    }, []);
};

export const useAnimatedContainerStyle = (
    visibilityState: Readonly<Animated.SharedValue<number>>,
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

    return animatedContainerStyle;
};

export const useDuplicateContentState = (
    isFullSizeDisplayed: boolean,
    setIsFullSizeDisplayed: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const duplicateContentState = useSharedValue<DuplicateContentState>(
        DuplicateContentState.Closed,
    );

    React.useEffect(() => {
        duplicateContentState.value = DuplicateContentState.Measurement;
    }, [duplicateContentState]);

    const closeDuplicateContentState = React.useCallback(() => {
        duplicateContentState.value = DuplicateContentState.Closed;
    }, [duplicateContentState]);

    const onPressUnderlay = React.useCallback(() => {
        setIsFullSizeDisplayed(false);
    }, [setIsFullSizeDisplayed]);

    React.useEffect(() => {
        if (!isFullSizeDisplayed && duplicateContentState.value === DuplicateContentState.Opened) {
            closeDuplicateContentState();
        }
    }, [isFullSizeDisplayed, duplicateContentState, closeDuplicateContentState]);

    return {
        duplicateContentState,
        onPressUnderlay,
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
                 * The timeout is in order to give time for the animation of the image to complete.
                 */
                setTimeout(() => {
                    onClose();
                }, UIConstant.demonstrator.animationDisplayDelay);
            }
            if (state === VisibilityState.Opened) {
                /**
                 * The timeout is in order to give time for the animation of the image
                 * unfolding to end and after that the fullSizeImage render starts.
                 * This will allow not to interrupt the animation with a heavy render.
                 */
                setTimeout(() => {
                    setIsFullSizeDisplayed(true);
                }, UIConstant.demonstrator.animationDisplayDelay);
            }
        },
        [onClose, setIsFullSizeDisplayed],
    );
};
