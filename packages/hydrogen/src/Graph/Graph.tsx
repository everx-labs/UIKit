import React from 'react';
import {
    View,
    StyleSheet,
    LayoutChangeEvent,
    Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as shape from 'd3-shape';
import Animated, {
    useSharedValue,
    useDerivedValue,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { interpolatePath, parse } from 'react-native-redash';

import { parsePath, getPointAtLength } from './SVG';

import Cursor from './Cursor';
// import Label from './Label';

const scale = (v: number, d: number[], r: number[]) => {
    'worklet';

    return interpolate(v, d, r, Extrapolate.CLAMP);
};

const scaleInvert = (y: number, d: number[], r: number[]) => {
    'worklet';

    return interpolate(y, r, d, Extrapolate.CLAMP);
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

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Graph = (props: IProps) => {
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
    const length = useSharedValue(0);
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
    const path = parsePath(d);

    const point = useDerivedValue(() => {
        const p = getPointAtLength(path, length.value);
        return {
            coord: {
                x: p.x,
                y: p.y,
            },
            data: {
                x: scaleInvert(p.x, domain.x, range.x),
                y: scaleInvert(p.y, domain.y, range.y),
            },
        };
    });

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

    const animatedProps = Animated.useAnimatedProps(() => {
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
            {/* <Label {...{ data, point }} /> */}
            <View>
                <Svg
                    {...{ width: dimensions.width, height: dimensions.height }}
                >
                    {/* <Defs>
                        <LinearGradient
                            x1="50%"
                            y1="0%"
                            x2="50%"
                            y2="100%"
                            id="gradient"
                        >
                            <Stop stopColor="#CDE3F8" offset="0%" />
                            <Stop stopColor="#eef6fd" offset="80%" />
                            <Stop stopColor="#FEFFFF" offset="100%" />
                        </LinearGradient>
                    </Defs> */}
                    {Platform.OS === 'web' ? (
                        <AnimatedPath
                            fill="transparent"
                            stroke="#367be2"
                            strokeWidth={2}
                            d={d}
                        />
                    ) : (
                        <AnimatedPath
                            animatedProps={animatedProps} // causes the web to crash
                            fill="transparent"
                            stroke="#367be2"
                            strokeWidth={2}
                        />
                    )}
                    {/* <Path
                        d={`${d}  L ${dimensions.width} ${dimensions.height} L 0 ${dimensions.height}`}
                        fill="url(#gradient)"
                    /> */}
                </Svg>
                <Cursor {...{ path, length, point }} />
            </View>
        </View>
    );
};

export default Graph;
