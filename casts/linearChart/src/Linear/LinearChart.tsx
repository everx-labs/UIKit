import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Path as SvgPath } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { TypographyVariants, UILabel, ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { addNativeProps } from '@tonlabs/uikit.controls';
import {
    LINEAR_CHART_CONTENT_HORIZONTAL_OFFSET,
    LINEAR_CHART_STROKE_WIDTH,
    LINEAR_CHART_HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    LINEAR_CHART_VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    LINEAR_CHART_INITIAL_DIMENSIONS,
} from './constants';
import type { LinearChartPoint, LinearChartDimensions, LinearChartLabelData } from './types';
import { useLabelData, useAnimatedPathProps } from './hooks';
import { formatLabelText } from './utils';

Animated.addWhitelistedNativeProps({ text: true, value: true });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: LINEAR_CHART_HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
        paddingVertical: LINEAR_CHART_VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    },
    chartContainer: {
        flex: 1,
        overflow: 'visible',
    },
    labelContainer: {
        height: 16,
        top: -8,
    },
    labelArea: {
        width: LINEAR_CHART_HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    },
    leftLabelArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        paddingLeft: LINEAR_CHART_CONTENT_HORIZONTAL_OFFSET,
        marginVertical: LINEAR_CHART_VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    },
    rightLabelArea: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        paddingLeft: 8,
        marginVertical: LINEAR_CHART_VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
    },
    extremumLabelArea: {
        left: LINEAR_CHART_HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
        right: LINEAR_CHART_HORIZONTAL_OFFSET_FROM_CHART_TO_THE_EDGE,
        height: LINEAR_CHART_VERTICAL_OFFSET_FROM_CHART_TO_THE_EDGE,
        alignItems: 'center',
        flexDirection: 'row',
    },
    maximumLabelArea: {
        position: 'absolute',
        top: 0,
    },
    extremumLabelContainer: {
        left: -50,
        height: 16,
        width: 100,
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    minimumLabelArea: {
        position: 'absolute',
        bottom: 0,
    },
});

const AnimatedPath = Animated.createAnimatedComponent(addNativeProps(SvgPath, { d: true }));
const AnimatedSvg = Animated.createAnimatedComponent(
    addNativeProps(Svg, {
        width: true,
        height: true,
    }),
);

/**
 * LinearChart props
 */
type IProps = {
    /** Data for the chart */
    data: LinearChartPoint[];
    /** ID for usage in tests */
    testID?: string;
};

export const LinearChart: React.FC<IProps> = (props: IProps) => {
    const theme = useTheme();
    const { data } = props;
    const dimensions = useSharedValue<LinearChartDimensions>({
        ...LINEAR_CHART_INITIAL_DIMENSIONS,
    });

    const onLayout = React.useCallback(
        (event: LayoutChangeEvent): void => {
            if (
                event.nativeEvent.layout.height !== dimensions.value.height ||
                event.nativeEvent.layout.width !== dimensions.value.width
            ) {
                /**
                 * We should subtract LINEAR_CHART_STROKE_WIDTH from dimensions.
                 * So that the thick line of the graph is not cut off at the edges of the graph.
                 * The line is built from its center.
                 */
                dimensions.value = {
                    height: event.nativeEvent.layout.height - LINEAR_CHART_STROKE_WIDTH,
                    width: event.nativeEvent.layout.width - LINEAR_CHART_STROKE_WIDTH,
                };
            }
        },
        [dimensions],
    );

    const animatedPathProps: Partial<{
        d: string;
    }> = useAnimatedPathProps(dimensions, data);

    const labelData: LinearChartLabelData = useLabelData(dimensions, data);

    const animatedSvgProps = useAnimatedProps(() => {
        return {
            width: dimensions.value.width + LINEAR_CHART_STROKE_WIDTH,
            height: dimensions.value.height + LINEAR_CHART_STROKE_WIDTH,
        };
    });

    return (
        <View testID={props.testID} style={styles.container}>
            <View onLayout={onLayout} style={styles.chartContainer}>
                <AnimatedSvg animatedProps={animatedSvgProps}>
                    <AnimatedPath
                        animatedProps={animatedPathProps}
                        fill="transparent"
                        // @ts-ignore
                        stroke={theme[ColorVariants.LineAccent]}
                        strokeWidth={LINEAR_CHART_STROKE_WIDTH}
                    />
                </AnimatedSvg>
            </View>
            <View style={[styles.labelArea, styles.leftLabelArea]}>
                <Animated.View style={[styles.labelContainer, labelData.leftLabelContainerStyle]}>
                    <UILabel
                        role={TypographyVariants.ParagraphLabel}
                        color={ColorVariants.TextPrimary}
                        testID="left-chart-label"
                    >
                        {formatLabelText(data[0].y)}
                    </UILabel>
                </Animated.View>
            </View>
            <View style={[styles.labelArea, styles.rightLabelArea]}>
                <Animated.View style={[styles.labelContainer, labelData.rightLabelContainerStyle]}>
                    <UILabel
                        role={TypographyVariants.ParagraphLabel}
                        color={ColorVariants.TextPrimary}
                        numberOfLines={1}
                        testID="right-chart-label"
                    >
                        {formatLabelText(data[data.length - 1].y)}
                    </UILabel>
                </Animated.View>
            </View>
            <View style={[styles.extremumLabelArea, styles.maximumLabelArea]}>
                <Animated.View
                    style={[styles.extremumLabelContainer, labelData.maximumLabelContainerStyle]}
                >
                    <Animated.View style={labelData.maximumLabelStyle}>
                        <UILabel
                            role={TypographyVariants.ParagraphLabel}
                            color={ColorVariants.TextTertiary}
                            numberOfLines={1}
                            testID="maximum-chart-label"
                        >
                            {formatLabelText(labelData.maximumValue)}
                        </UILabel>
                    </Animated.View>
                </Animated.View>
            </View>
            <View style={[styles.extremumLabelArea, styles.minimumLabelArea]}>
                <Animated.View
                    style={[styles.extremumLabelContainer, labelData.minimumLabelContainerStyle]}
                >
                    <Animated.View style={labelData.minimumLabelStyle}>
                        <UILabel
                            role={TypographyVariants.ParagraphLabel}
                            color={ColorVariants.TextTertiary}
                            numberOfLines={1}
                            testID="minimum-chart-label"
                        >
                            {formatLabelText(labelData.minimumValue)}
                        </UILabel>
                    </Animated.View>
                </Animated.View>
            </View>
        </View>
    );
};
