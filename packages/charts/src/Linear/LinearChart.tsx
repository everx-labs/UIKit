import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent, ViewStyle } from 'react-native';
import Svg, { Path as SvgPath } from 'react-native-svg';
import Animated, { runOnUI } from 'react-native-reanimated';
import { Path, serialize } from 'react-native-redash';

import { addNativeProps } from '../Utils';
import {
    convertDataToPath,
    interpolatePath,
    getScaledData,
    getControlPoints,
} from './linearChartUtils';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
    },
    chartСontainer: {
        flex: 1,
    },
    labelContainer: {
        position: 'absolute',
        top: -8,
        height: 16,
        width: 40,
    },
    label: {
        flex: 1,
        borderWidth: 1,
    },
    leftLabelContainer: {
        left: 0,
    },
    rightLabelContainer: {
        right: 0,
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

const AnimatedPath = Animated.createAnimatedComponent(addNativeProps(SvgPath));
const AnimatedSvg = Animated.createAnimatedComponent(addNativeProps(Svg));

type LabelStyles = {
    leftLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    leftLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    rightLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    rightLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
};
const useLabelStyles = (
    dimensions: Animated.SharedValue<Dimensions>,
    data: Point[],
): LabelStyles => {
    const startLabelYCoordinate = Animated.useSharedValue<number | null>(null);
    const endLabelYCoordinate = Animated.useSharedValue<number | null>(null);

    Animated.useDerivedValue(() => {
        'worklet';

        if (dimensions.value.height === 0 || dimensions.value.width === 0) {
            return;
        }

        const scaledData: Point[] = getScaledData(data, dimensions.value);
        const controlPoints = getControlPoints(data, scaledData);
        if (startLabelYCoordinate.value !== controlPoints.start.y) {
            if (startLabelYCoordinate.value === null) {
                startLabelYCoordinate.value = controlPoints.start.y;
            }
            startLabelYCoordinate.value = Animated.withSpring(
                controlPoints.start.y,
                withSpringConfig,
            );
        }
        if (endLabelYCoordinate.value !== controlPoints.end.y) {
            if (endLabelYCoordinate.value === null) {
                endLabelYCoordinate.value = controlPoints.end.y;
            }
            endLabelYCoordinate.value = Animated.withSpring(
                controlPoints.end.y,
                withSpringConfig,
            );
        }
    }, [data]);

    const leftLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY:
                        startLabelYCoordinate.value === null
                            ? 0
                            : startLabelYCoordinate.value,
                },
            ],
        };
    });
    const leftLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity: startLabelYCoordinate.value === null ? 0 : 1,
        };
    });

    const rightLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY:
                        endLabelYCoordinate.value === null
                            ? 0
                            : endLabelYCoordinate.value,
                },
            ],
        };
    });

    const rightLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity: endLabelYCoordinate.value === null ? 0 : 1,
        };
    });
    return {
        leftLabelStyle,
        leftLabelContainerStyle,
        rightLabelStyle,
        rightLabelContainerStyle,
    };
};

const useAnimatedPathProps = (
    dimensions: Animated.SharedValue<Dimensions>,
    data: Point[],
): Partial<{
    d: string;
}> => {
    const progress = Animated.useSharedValue<number>(0);
    const progressTarget = Animated.useSharedValue<number>(0);

    const intermediatePath = Animated.useSharedValue<Path | null>(null);

    const targetPath = Animated.useDerivedValue(() => {
        'worklet';

        return convertDataToPath(data, dimensions.value);
    }, [data, dimensions]);

    const currentPath = Animated.useDerivedValue<Path>(() => {
        'worklet';

        return interpolatePath(
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

            if (!dimensions.value.width || !dimensions.value.height) {
                progress.value = progressTarget.value;
            } else {
                progress.value = Animated.withSpring(
                    progressTarget.value,
                    withSpringConfig,
                );
            }
        })();
    }, [
        data,
        progressTarget,
        intermediatePath,
        currentPath,
        progress,
        dimensions,
    ]);

    const animatedPathProps = Animated.useAnimatedProps(() => {
        'worklet';

        return {
            d: serialize(currentPath.value),
        };
    }, [currentPath]);

    return animatedPathProps;
};

export const LinearChart: React.FC<IProps> = (props: IProps) => {
    const { data } = props;

    const dimensions = Animated.useSharedValue<Dimensions>({
        ...initialDimensions,
    });

    const onLayout = React.useCallback(
        (event: LayoutChangeEvent): void => {
            if (
                event.nativeEvent.layout.height !== dimensions.value.height ||
                event.nativeEvent.layout.width !== dimensions.value.width
            ) {
                dimensions.value = {
                    height: event.nativeEvent.layout.height,
                    width: event.nativeEvent.layout.width,
                };
            }
        },
        [dimensions],
    );

    const animatedPathProps: Partial<{
        d: string;
    }> = useAnimatedPathProps(dimensions, data);

    const labelStyles: LabelStyles = useLabelStyles(dimensions, data);

    const animatedSvgProps = Animated.useAnimatedProps(() => {
        'worklet';

        return {
            width: dimensions.value.width,
            height: dimensions.value.height,
        };
    });

    return (
        <View testID={props.testID} style={styles.container}>
            <View onLayout={onLayout} style={styles.chartСontainer}>
                <AnimatedSvg animatedProps={animatedSvgProps}>
                    <AnimatedPath
                        animatedProps={animatedPathProps}
                        fill="transparent"
                        stroke="#367be2"
                        strokeWidth={2}
                    />
                </AnimatedSvg>
            </View>
            <Animated.View
                style={[
                    styles.labelContainer,
                    styles.leftLabelContainer,
                    labelStyles.leftLabelContainerStyle,
                ]}
            >
                <Animated.View
                    style={[styles.label, labelStyles.leftLabelStyle]}
                />
            </Animated.View>
            <Animated.View
                style={[
                    styles.labelContainer,
                    styles.rightLabelContainer,
                    labelStyles.rightLabelContainerStyle,
                ]}
            >
                <Animated.View
                    style={[styles.label, labelStyles.rightLabelStyle]}
                />
            </Animated.View>
        </View>
    );
};
