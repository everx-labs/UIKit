import type { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedReaction, measure } from 'react-native-reanimated';
import type { Dimensions } from '../types';
import type { DuplicateState } from '../constants';

// @inline
const DUPLICATE_STATE_MEASUREMENT: DuplicateState = 1;

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
                    (!prevState || prevState.duplicateState !== DUPLICATE_STATE_MEASUREMENT) &&
                    state.duplicateState === DUPLICATE_STATE_MEASUREMENT
                ) {
                    const measurements = measure(state.forwardedRef);

                    console.log({ measurements });

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
        [forwardedRef.current],
    );

    return {
        width,
        height,
        pageX,
        pageY,
    };
};
