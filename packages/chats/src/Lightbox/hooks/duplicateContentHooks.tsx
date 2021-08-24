import * as React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import Animated, {
    useDerivedValue,
    withSpring,
    useAnimatedStyle,
    interpolate,
    useSharedValue,
    runOnJS,
    useWorkletCallback,
    withDelay,
    withTiming,
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

    const openedImageScale = useDerivedValue(() => {
        const aspectRatio = width.value / height.value;
        if (aspectRatio > fieldAspectRatio) {
            return maxWidth && width.value ? maxWidth / width.value : 1;
        }
        return maxHeight && height.value ? maxHeight / height.value : 1;
    }, [maxWidth, maxHeight, fieldAspectRatio]);

    const centeredImageX = useDerivedValue(() => {
        return (
            (windowDimensions.width * (openedImageScale.value - 1)) / 2 +
            (windowDimensions.width - width.value * openedImageScale.value) / 2
        );
    }, [windowDimensions.width]);

    const centeredImageY = useDerivedValue(() => {
        return (
            (windowDimensions.height * (openedImageScale.value - 1)) / 2 +
            (windowDimensions.height - height.value * openedImageScale.value) / 2
        );
    }, [windowDimensions.height]);

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

const runUISetWithDelay = (toValue: number): number => {
    'worklet';

    return withDelay(100, withTiming(toValue, { duration: 0 }));
};

export const useDuplicateContentState = (
    isFullSizeDisplayed: boolean,
    setIsFullSizeDisplayed: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const duplicateContentState = useSharedValue<DuplicateContentState>(
        DuplicateContentState.Initial,
    );

    React.useEffect(() => {
        duplicateContentState.value = DuplicateContentState.Measurement;
    }, [duplicateContentState]);

    const onPressClose = React.useCallback(() => {
        /**
         * First we hide the heavy FullSizeImage for performance needs
         */
        setIsFullSizeDisplayed(false);
    }, [setIsFullSizeDisplayed]);

    const onMeasureEnd = useWorkletCallback(() => {
        if (Platform.OS === 'android') {
            /**
             * On android, it takes time to render the image.
             * You should add a mechanism for copying the image without a heavy mounting mechanism
             */
            duplicateContentState.value = runUISetWithDelay(DuplicateContentState.Opened);
        } else {
            duplicateContentState.value = DuplicateContentState.Opened;
        }
    });

    React.useEffect(() => {
        /**
         * We collapse the container only after we have removed the heavy fullSizeImage
         */
        if (!isFullSizeDisplayed && duplicateContentState.value === DuplicateContentState.Opened) {
            duplicateContentState.value = DuplicateContentState.Closed;
        }
    }, [isFullSizeDisplayed, duplicateContentState]);

    return {
        duplicateContentState,
        onPressClose,
        onMeasureEnd,
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
