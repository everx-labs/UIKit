import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { runOnUI } from 'react-native-reanimated';
import { Path as RedashPath, serialize } from 'react-native-redash';

import { addNativeProps } from '../Utils';
import { convertDataToPath, interpolatePathCustom } from './pathUtil';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export type Dimensions = {
    width: number;
    height: number;
};
const initialDimensions: Dimensions = {
    width: 0,
    height: 0,
};

const withSpringConfig: Animated.WithSpringConfig = {
    damping: 100,
    stiffness: 200,
};

const getOppositeProgressTarget = (progressTarget: number): number => {
    'worklet';

    return progressTarget ? 0 : 1;
};

export type Point = {
    x: number;
    y: number;
};

type IProps = {
    data: Point[];
    testID?: string;
};

const AnimatedPath = Animated.createAnimatedComponent(addNativeProps(Path));

export const LinearChart = (props: IProps) => {
    const { data } = props;

    const [dimensions, setDimensions] = React.useState<Dimensions>(
        initialDimensions,
    );
    const [previousDimensions, setPreviousDimensions] = React.useState<
        Dimensions
    >(dimensions);

    const onLayout = React.useCallback(
        (event: LayoutChangeEvent): void => {
            if (
                event.nativeEvent.layout.height !== dimensions.height ||
                event.nativeEvent.layout.width !== dimensions.width
            ) {
                setDimensions({
                    height: event.nativeEvent.layout.height,
                    width: event.nativeEvent.layout.width,
                });
            }
        },
        [dimensions],
    );

    const progressTarget = Animated.useSharedValue<number>(0);

    const intermediatePath = Animated.useSharedValue<RedashPath | null>(null);

    const targetPath = Animated.useDerivedValue(() => {
        'worklet';

        return convertDataToPath(data, dimensions);
    }, [data, dimensions]);

    const progress = Animated.useSharedValue<number>(0);

    const currentPath = Animated.useDerivedValue<RedashPath>(() => {
        'worklet';

        return interpolatePathCustom(
            progress.value,
            [
                getOppositeProgressTarget(progressTarget.value),
                progressTarget.value,
            ],
            [
                intermediatePath.value
                    ? intermediatePath.value
                    : targetPath.value,
                targetPath.value,
            ],
            Animated.Extrapolate.CLAMP,
        );
    });

    React.useEffect(() => {
        runOnUI(() => {
            'worklet';

            progress.value = progressTarget.value;
            progressTarget.value = getOppositeProgressTarget(
                progressTarget.value,
            );
            intermediatePath.value = currentPath.value;

            if (
                previousDimensions.width &&
                previousDimensions.height &&
                dimensions.width &&
                dimensions.height &&
                dimensions.width === previousDimensions.width &&
                dimensions.height === previousDimensions.height
            ) {
                progress.value = Animated.withSpring(
                    progressTarget.value,
                    withSpringConfig,
                );
            } else {
                progress.value = progressTarget.value;
            }
        })();
        return () => {
            if (
                previousDimensions.height !== dimensions.height ||
                previousDimensions.width !== dimensions.width
            ) {
                setPreviousDimensions(dimensions);
            }
        };
    }, [
        data,
        progressTarget,
        intermediatePath,
        currentPath,
        progress,
        dimensions,
        previousDimensions,
    ]);

    const animatedProps: Partial<Animated.AnimateProps<
        any
    >> = Animated.useAnimatedProps(() => {
        'worklet';

        return {
            d: serialize(currentPath.value),
        };
    }, [currentPath]);

    return (
        <View
            testID={props.testID}
            style={styles.container}
            onLayout={onLayout}
        >
            <Svg width={dimensions.width} height={dimensions.height}>
                <AnimatedPath
                    animatedProps={animatedProps}
                    fill="transparent"
                    stroke="#367be2"
                    strokeWidth={2}
                />
            </Svg>
        </View>
    );
};
