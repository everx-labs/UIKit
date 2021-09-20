import * as React from 'react';
import Animated, {
    runOnUI,
    useAnimatedProps,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Path, serialize } from 'react-native-redash';
import type { LinearChartDimensions, LinearChartPoint } from '../../types';
import { convertDataToPath, interpolatePath, negateProgressTarget } from '../utils';
import { LINEAR_CHART_STROKE_WIDTH, LINEAR_CHART_WITH_SPRING_CONFIG } from '../../constants';

export const useAnimatedPathProps = (
    dimensions: Animated.SharedValue<LinearChartDimensions>,
    data: LinearChartPoint[],
): Partial<{
    d: string;
}> => {
    const progress = useSharedValue<number>(0);
    const progressTarget = useSharedValue<number>(0);

    /** Used to avoid unwanted chart jumps.
     * We need it to save path state if the animation did not have time to end,
     * and the data changed again.
     */
    const intermediatePath = useSharedValue<Path | null>(null);

    const targetPath = useDerivedValue(() => {
        return convertDataToPath(data, dimensions.value, LINEAR_CHART_STROKE_WIDTH);
    }, [data, dimensions]);

    const currentPath = useDerivedValue<Path | null>(() => {
        if (targetPath.value === null) {
            return null;
        }
        if (targetPath.value.curves.length !== intermediatePath.value?.curves.length) {
            /**
             * If the number of points has changed, the interpolatePath function crashes with an error
             * TODO: Remove this if-block and fix these crashes.
             */
            return targetPath.value;
        }
        return interpolatePath(
            progress.value,
            [negateProgressTarget(progressTarget.value), progressTarget.value],
            [intermediatePath.value ? intermediatePath.value : targetPath.value, targetPath.value],
            Animated.Extrapolate.CLAMP,
        );
    });

    // Don't use useDerivedValue because it leads to an infinite loop
    React.useEffect(() => {
        runOnUI(() => {
            'worklet';

            progress.value = progressTarget.value;
            progressTarget.value = negateProgressTarget(progressTarget.value);
            intermediatePath.value = currentPath.value;

            if (!dimensions.value.width || !dimensions.value.height) {
                progress.value = progressTarget.value;
            } else {
                progress.value = withSpring(progressTarget.value, LINEAR_CHART_WITH_SPRING_CONFIG);
            }
        })();
    }, [data, progressTarget, intermediatePath, currentPath, progress, dimensions]);

    const animatedPathProps = useAnimatedProps(() => {
        if (currentPath.value === null) {
            return {
                d: '',
            };
        }
        return {
            d: serialize(currentPath.value),
        };
    }, [currentPath]);

    return animatedPathProps;
};
