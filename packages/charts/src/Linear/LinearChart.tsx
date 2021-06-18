import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent, ViewStyle } from 'react-native';
import Svg, { Path as SvgPath } from 'react-native-svg';
import Animated, { runOnUI } from 'react-native-reanimated';
import { Path, serialize } from 'react-native-redash';
import {
    UILabel,
    TypographyVariants,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';
import { addNativeProps } from '../Utils';
import {
    convertDataToPath,
    interpolatePath,
    getScaledData,
    getControlPoints,
    ControlPoints,
} from './linearChartUtils';

Animated.addWhitelistedNativeProps({ text: true, value: true });

const CONTENT_HORIZONTAL_OFFSET: number = 16;
const STROKE_WIDTH: number = 2;
const HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE: number = 60;
const VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE: number = 24;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
        paddingVertical: VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    },
    chartСontainer: {
        flex: 1,
        overflow: 'visible',
    },
    labelContainer: {
        height: 16,
        top: -8,
    },
    labelArea: {
        width: HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    },
    leftLabelArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        paddingLeft: CONTENT_HORIZONTAL_OFFSET,
        marginVertical: VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    },
    rightLabelArea: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        paddingLeft: 8,
        marginVertical: VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    },
    extremumLabelArea: {
        left: HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
        right: HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
        height: VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
        alignItems: 'center',
        flexDirection: 'row',
    },
    maximumLabelArea: {
        position: 'absolute',
        top: 0,
    },
    extremumLabelContainer: {
        left: -25,
        height: 16,
        width: 50,
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    minimumLabelArea: {
        position: 'absolute',
        bottom: 0,
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

const useLabelCoordinates = (
    dimensions: Animated.SharedValue<Dimensions>,
    controlPoints: Readonly<Animated.SharedValue<ControlPoints | null>>,
) => {
    const minimumLabelXCoordinate = Animated.useSharedValue<number>(0);
    const maximumLabelXCoordinate = Animated.useSharedValue<number>(0);
    const startLabelYCoordinate = Animated.useSharedValue<number>(0);
    const endLabelYCoordinate = Animated.useSharedValue<number>(0);

    type AnimatedState = {
        dimensions: Dimensions;
        controlPoints: ControlPoints | null;
    };
    Animated.useAnimatedReaction(
        () => {
            return {
                dimensions: dimensions.value,
                controlPoints: controlPoints.value,
            };
        },
        (
            currentAnimatedState: AnimatedState,
            previousAnimatedState: AnimatedState | null,
        ) => {
            if (currentAnimatedState.controlPoints === null) {
                return;
            }
            if (
                !previousAnimatedState ||
                currentAnimatedState.dimensions.width !==
                    previousAnimatedState.dimensions.width ||
                currentAnimatedState.dimensions.height !==
                    previousAnimatedState.dimensions.height ||
                !previousAnimatedState.controlPoints
            ) {
                minimumLabelXCoordinate.value =
                    currentAnimatedState.controlPoints.minimum.x;
                maximumLabelXCoordinate.value =
                    currentAnimatedState.controlPoints.maximum.x;
                startLabelYCoordinate.value =
                    currentAnimatedState.controlPoints.start.y;
                endLabelYCoordinate.value =
                    currentAnimatedState.controlPoints.end.y;
            } else {
                minimumLabelXCoordinate.value = Animated.withSpring(
                    currentAnimatedState.controlPoints.minimum.x,
                    withSpringConfig,
                );
                maximumLabelXCoordinate.value = Animated.withSpring(
                    currentAnimatedState.controlPoints.maximum.x,
                    withSpringConfig,
                );
                startLabelYCoordinate.value = Animated.withSpring(
                    currentAnimatedState.controlPoints.start.y,
                    withSpringConfig,
                );
                endLabelYCoordinate.value = Animated.withSpring(
                    currentAnimatedState.controlPoints.end.y,
                    withSpringConfig,
                );
            }
        },
        [controlPoints.value, dimensions.value],
    );

    return {
        minimumLabelXCoordinate,
        maximumLabelXCoordinate,
        startLabelYCoordinate,
        endLabelYCoordinate,
    };
};

const useLabelStyles = (
    dimensions: Animated.SharedValue<Dimensions>,
    controlPoints: Readonly<Animated.SharedValue<ControlPoints | null>>,
    minimumLabelXCoordinate: Animated.SharedValue<number>,
    maximumLabelXCoordinate: Animated.SharedValue<number>,
    startLabelYCoordinate: Animated.SharedValue<number>,
    endLabelYCoordinate: Animated.SharedValue<number>,
) => {
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

    const maximumLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX:
                        maximumLabelXCoordinate.value === null
                            ? 0
                            : maximumLabelXCoordinate.value,
                },
            ],
        };
    });
    const maximumLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity:
                maximumLabelXCoordinate.value === null ||
                controlPoints.value?.maximum.x === 0 ||
                controlPoints.value?.maximum.x === dimensions.value.width
                    ? 0
                    : 1,
        };
    });

    const minimumLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX:
                        minimumLabelXCoordinate.value === null
                            ? 0
                            : minimumLabelXCoordinate.value,
                },
            ],
        };
    });
    const minimumLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity:
                minimumLabelXCoordinate.value === null ||
                controlPoints.value?.minimum.x === 0 ||
                controlPoints.value?.minimum.x === dimensions.value.width
                    ? 0
                    : 1,
        };
    });
    return {
        leftLabelStyle,
        leftLabelContainerStyle,
        rightLabelStyle,
        rightLabelContainerStyle,
        maximumLabelContainerStyle,
        maximumLabelStyle,
        minimumLabelContainerStyle,
        minimumLabelStyle,
    };
};

const useLabelText = (
    controlPoints: Readonly<Animated.SharedValue<ControlPoints | null>>,
) => {
    const maximum = Animated.useDerivedValue<number | null>(() => {
        if (controlPoints.value === null) {
            return null;
        }
        return controlPoints.value.maximum.value;
    });
    const minimum = Animated.useDerivedValue<number | null>(() => {
        if (controlPoints.value === null) {
            return null;
        }
        return controlPoints.value.minimum.value;
    });

    const maximumText = Animated.useDerivedValue(() => {
        'worklet';

        return maximum.value ? maximum.value.toFixed(2) : '';
    }, []);
    const minimumText = Animated.useDerivedValue(() => {
        'worklet';

        return minimum.value ? minimum.value.toFixed(2) : 'Empty';
    }, []);

    const [minimumValue, setMinimumValue] = React.useState<string>('');
    const [maximumValue, setMaximumValue] = React.useState<string>('');

    Animated.useAnimatedReaction(
        () => minimumText.value,
        (text: string) => {
            Animated.runOnJS(setMinimumValue)(text);
        },
    );

    Animated.useAnimatedReaction(
        () => maximumText.value,
        (text: string) => {
            Animated.runOnJS(setMaximumValue)(text);
        },
    );

    return {
        minimumValue,
        maximumValue,
    };
};

type LabelData = {
    leftLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    leftLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    rightLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    rightLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    minimumLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    minimumLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumValue: string;
    minimumValue: string;
};
const useLabelData = (
    dimensions: Animated.SharedValue<Dimensions>,
    data: Point[],
): LabelData => {
    const scaledData = Animated.useDerivedValue<Point[] | null>(() => {
        return getScaledData(data, dimensions.value);
    }, [data]);

    const controlPoints = Animated.useDerivedValue<ControlPoints | null>(() => {
        return getControlPoints(data, scaledData.value, STROKE_WIDTH);
    }, [data]);

    const {
        minimumLabelXCoordinate,
        maximumLabelXCoordinate,
        startLabelYCoordinate,
        endLabelYCoordinate,
    } = useLabelCoordinates(dimensions, controlPoints);

    const {
        leftLabelStyle,
        leftLabelContainerStyle,
        rightLabelStyle,
        rightLabelContainerStyle,
        maximumLabelContainerStyle,
        maximumLabelStyle,
        minimumLabelContainerStyle,
        minimumLabelStyle,
    } = useLabelStyles(
        dimensions,
        controlPoints,
        minimumLabelXCoordinate,
        maximumLabelXCoordinate,
        startLabelYCoordinate,
        endLabelYCoordinate,
    );

    const { minimumValue, maximumValue } = useLabelText(controlPoints);

    return {
        leftLabelStyle,
        leftLabelContainerStyle,
        rightLabelStyle,
        rightLabelContainerStyle,
        maximumLabelContainerStyle,
        maximumLabelStyle,
        minimumLabelContainerStyle,
        minimumLabelStyle,
        maximumValue,
        minimumValue,
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

        return convertDataToPath(data, dimensions.value, STROKE_WIDTH);
    }, [data, dimensions]);

    const currentPath = Animated.useDerivedValue<Path | null>(() => {
        'worklet';

        if (targetPath.value === null) {
            return null;
        }

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
                    height: event.nativeEvent.layout.height - STROKE_WIDTH,
                    width: event.nativeEvent.layout.width - STROKE_WIDTH,
                };
            }
        },
        [dimensions],
    );

    const animatedPathProps: Partial<{
        d: string;
    }> = useAnimatedPathProps(dimensions, data);

    const labelData: LabelData = useLabelData(dimensions, data);

    const animatedSvgProps = Animated.useAnimatedProps(() => {
        'worklet';

        return {
            width: dimensions.value.width + STROKE_WIDTH,
            height: dimensions.value.height + STROKE_WIDTH,
        };
    });

    return (
        <View testID={props.testID} style={styles.container}>
            <View onLayout={onLayout} style={styles.chartСontainer}>
                <AnimatedSvg
                    animatedProps={animatedSvgProps}
                    style={{
                        overflow: 'visible',
                    }}
                >
                    <AnimatedPath
                        animatedProps={animatedPathProps}
                        fill="transparent"
                        stroke="#367be2"
                        strokeWidth={STROKE_WIDTH}
                    />
                </AnimatedSvg>
            </View>
            <View style={[styles.labelArea, styles.leftLabelArea]}>
                <Animated.View
                    style={[
                        styles.labelContainer,
                        labelData.leftLabelContainerStyle,
                    ]}
                >
                    <Animated.View style={[labelData.leftLabelStyle]}>
                        <UILabel
                            role={TypographyVariants.ParagraphLabel}
                            color={ColorVariants.TextPrimary}
                        >
                            {data[0].y.toFixed(2)}
                        </UILabel>
                    </Animated.View>
                </Animated.View>
            </View>
            <View style={[styles.labelArea, styles.rightLabelArea]}>
                <Animated.View
                    style={[
                        styles.labelContainer,
                        labelData.rightLabelContainerStyle,
                    ]}
                >
                    <Animated.View style={[labelData.rightLabelStyle]}>
                        <UILabel
                            role={TypographyVariants.ParagraphLabel}
                            color={ColorVariants.TextPrimary}
                            numberOfLines={1}
                        >
                            {data[data.length - 1].y.toFixed(2)}
                        </UILabel>
                    </Animated.View>
                </Animated.View>
            </View>
            <View style={[styles.extremumLabelArea, styles.maximumLabelArea]}>
                <Animated.View
                    style={[
                        styles.extremumLabelContainer,
                        labelData.maximumLabelContainerStyle,
                    ]}
                >
                    <Animated.View style={labelData.maximumLabelStyle}>
                        <UILabel
                            role={TypographyVariants.ParagraphLabel}
                            color={ColorVariants.TextTertiary}
                            numberOfLines={1}
                        >
                            {labelData.maximumValue}
                        </UILabel>
                    </Animated.View>
                </Animated.View>
            </View>
            <View style={[styles.extremumLabelArea, styles.minimumLabelArea]}>
                <Animated.View
                    style={[
                        styles.extremumLabelContainer,
                        labelData.minimumLabelContainerStyle,
                    ]}
                >
                    <Animated.View style={labelData.minimumLabelStyle}>
                        <UILabel
                            role={TypographyVariants.ParagraphLabel}
                            color={ColorVariants.TextTertiary}
                            numberOfLines={1}
                        >
                            {labelData.minimumValue}
                        </UILabel>
                    </Animated.View>
                </Animated.View>
            </View>
        </View>
    );
};
