import { useWindowDimensions, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import type { Dimensions } from '../types';
import { DuplicateState } from '../constants';

type Measurements = {
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
};

const measure = (forwardedRef: React.RefObject<View>): Promise<Measurements> => {
    return new Promise((resolve, reject) => {
        if (forwardedRef && forwardedRef.current) {
            forwardedRef.current.measure((x, y, width, height, pageX, pageY) => {
                resolve({ x, y, width, height, pageX, pageY });
            });
        } else {
            reject(new Error('measure: animated ref not ready'));
        }
    });
};

export const useDimensions = (
    forwardedRef: React.RefObject<View>,
    duplicateState: Animated.SharedValue<DuplicateState>,
    onMeasureEnd: () => void,
): Dimensions => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const width = useSharedValue<number>(0);
    const height = useSharedValue<number>(0);
    const pageX = useSharedValue<number>(0);
    const pageY = useSharedValue<number>(0);

    useAnimatedReaction(
        () => {
            return {
                duplicateState: duplicateState.value,
                windowWidth,
                windowHeight,
            };
        },
        (state, prevState) => {
            if (
                !prevState ||
                (prevState.duplicateState !== DuplicateState.Measurement &&
                    state.duplicateState === DuplicateState.Measurement) ||
                prevState.windowHeight !== state.windowHeight ||
                prevState.windowWidth !== state.windowWidth
            ) {
                measure(forwardedRef)
                    .then(measurements => {
                        width.value = measurements.width;
                        height.value = measurements.height;
                        pageX.value = measurements.pageX;
                        pageY.value = measurements.pageY;

                        onMeasureEnd();
                    })
                    .catch(reason => {
                        console.error(`useDimensions.web.tsx: Measuring is failed - ${reason}`);
                    });
            }
        },
        [windowWidth, windowHeight],
    );

    return {
        width,
        height,
        pageX,
        pageY,
    };
};
