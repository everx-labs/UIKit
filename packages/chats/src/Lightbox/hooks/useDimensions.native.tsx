import type { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedReaction, measure } from 'react-native-reanimated';
import type { Dimensions } from '../types';
import { DuplicateState } from '../constants';

export const useDimensions = (
    forwardedRef: React.RefObject<View>,
    duplicateState: Animated.SharedValue<DuplicateState>,
    onMeasureEnd: () => void,
): Dimensions => {
    const width = useSharedValue<number>(0);
    const height = useSharedValue<number>(0);
    const pageX = useSharedValue<number>(0);
    const pageY = useSharedValue<number>(0);

    useAnimatedReaction(
        () => {
            return {
                duplicateState: duplicateState.value,
                forwardedRef,
            };
        },
        (state, prevState) => {
            try {
                if (
                    (!prevState || prevState.duplicateState !== DuplicateState.Measurement) &&
                    state.duplicateState === DuplicateState.Measurement
                ) {
                    const measurements = measure(state.forwardedRef);

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
        [forwardedRef],
    );

    return {
        width,
        height,
        pageX,
        pageY,
    };
};
