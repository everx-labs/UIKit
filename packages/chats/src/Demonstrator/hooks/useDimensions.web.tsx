import type { View } from 'react-native';
import Animated, {
    useSharedValue,
    useDerivedValue,
} from 'react-native-reanimated';
import type { Dimensions } from '../types';
import { VisibilityState } from '../constants';

type Measurements = {
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
};

const measure = (originalRef: React.RefObject<View>): Promise<Measurements> => {
    return new Promise((resolve, reject) => {
        if (originalRef && originalRef.current) {
            originalRef.current.measure((x, y, width, height, pageX, pageY) => {
                resolve({ x, y, width, height, pageX, pageY });
            });
        } else {
            reject(new Error('measure: animated ref not ready'));
        }
    });
};

export const useDimensions = (
    originalRef: React.RefObject<View>,
    visibilityState: Animated.SharedValue<VisibilityState>,
): Dimensions => {
    const width = useSharedValue<number>(0);
    const height = useSharedValue<number>(0);
    const pageX = useSharedValue<number>(0);
    const pageY = useSharedValue<number>(0);

    useDerivedValue(() => {
        if (visibilityState.value === VisibilityState.Measurement) {
            measure(originalRef).then((measurements) => {
                width.value = measurements.width;
                height.value = measurements.height;
                pageX.value = measurements.pageX;
                pageY.value = measurements.pageY;

                // eslint-disable-next-line no-param-reassign
                visibilityState.value = VisibilityState.Opened;
            });
        }
    }, []);

    return {
        width,
        height,
        pageX,
        pageY,
    };
};
