import type { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedReaction, measure } from 'react-native-reanimated';
import type { Dimensions } from '../types';
import { DuplicateContentState } from '../constants';

export const useDimensions = (
    originalRef: React.RefObject<View>,
    duplicateContentState: Animated.SharedValue<DuplicateContentState>,
    onMeasureEnd: () => void,
): Dimensions => {
    const width = useSharedValue<number>(0);
    const height = useSharedValue<number>(0);
    const pageX = useSharedValue<number>(0);
    const pageY = useSharedValue<number>(0);

    useAnimatedReaction(
        () => {
            return {
                duplicateContentState: duplicateContentState.value,
                originalRef,
            };
        },
        (state, prevState) => {
            try {
                if (
                    (!prevState ||
                        prevState.duplicateContentState !== DuplicateContentState.Measurement) &&
                    state.duplicateContentState === DuplicateContentState.Measurement
                ) {
                    const measurements = measure(state.originalRef);

                    width.value = measurements.width;
                    height.value = measurements.height;
                    pageY.value = measurements.pageY;
                    pageX.value = measurements.pageX;

                    onMeasureEnd();
                }
            } catch (e) {
                console.error(`useDimensions.native.tsx: Measuring is failed - ${e}`);
            }
        },
        [originalRef],
    );

    return {
        width,
        height,
        pageX,
        pageY,
    };
};
