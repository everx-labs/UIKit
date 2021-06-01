import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as shape from 'd3-shape';
import Animated, { interpolate, Extrapolate } from 'react-native-reanimated';
import { interpolatePath, parse } from 'react-native-redash';

import { addNativeProps } from '../Utils';

const scale = (v: number, d: number[], r: number[]) => {
    'worklet';

    return interpolate(v, d, r, Extrapolate.CLAMP);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

type Dimensions = {
    width: number;
    height: number;
};
const initialDimensions: Dimensions = {
    width: 10,
    height: 10,
};

type IProps = {
    data: [number, number][];
};

const AnimatedPath = Animated.createAnimatedComponent(addNativeProps(Path));

export const LinearChart = (props: IProps) => {
    const { data } = props;

    const domain = {
        x: [
            Math.min(...data.map(([x]) => x)),
            Math.max(...data.map(([x]) => x)),
        ],
        y: [
            Math.min(...data.map(([, y]) => y)),
            Math.max(...data.map(([, y]) => y)),
        ],
    };
    // const length = useSharedValue(0);
    const [dimensions, setDimensions] = React.useState<Dimensions>(
        initialDimensions,
    );
    const onLayout = (event: LayoutChangeEvent): void => {
        if (
            event.nativeEvent.layout.height !== dimensions.height ||
            event.nativeEvent.layout.width !== dimensions.width
        ) {
            setDimensions({
                height: event.nativeEvent.layout.height,
                width: event.nativeEvent.layout.width,
            });
        }
    };

    const range = {
        x: [0, dimensions.width],
        y: [dimensions.height, 0],
    };

    const d = shape
        .line()
        .x(([x]) => scale(x, domain.x, range.x))
        .y(([, y]) => scale(y, domain.y, range.y))
        .curve(shape.curveBasis)(data) as string;

    const [current, setCurrent] = React.useState(0);
    const [previousPath, setPreviousPath] = React.useState(parse(d));
    const [currentPath, setCurrentPath] = React.useState(parse(d));

    const progress = Animated.useSharedValue(0);

    React.useEffect(() => {
        setCurrentPath(parse(d));
        setCurrent((t) => {
            return t ? 0 : 1;
        });
        return () => {
            setPreviousPath(parse(d));
        };
    }, [d]);

    React.useEffect(() => {
        progress.value = Animated.withTiming(current ? 0 : 1, {
            duration: 400,
        });
    }, [progress, current]);

    const animatedProps: Partial<Animated.AnimateProps<
        any
    >> = Animated.useAnimatedProps(() => {
        return {
            d: interpolatePath(
                progress.value,
                [current, current ? 0 : 1],
                [previousPath, currentPath],
            ),
        };
    }, [progress, current, previousPath, currentPath]);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <View>
                <Svg
                    {...{ width: dimensions.width, height: dimensions.height }}
                >
                    <AnimatedPath
                        animatedProps={animatedProps}
                        fill="transparent"
                        stroke="#367be2"
                        strokeWidth={2}
                    />
                </Svg>
            </View>
        </View>
    );
};
