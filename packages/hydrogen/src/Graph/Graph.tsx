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

    // const count = Animated.useSharedValue(0)
    const progress = Animated.useSharedValue(0);
    // const animatedPath = Animated.useSharedValue(path)
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
    console.log({d})

    // const mockD = "M0,191.59433746362834L3.718390804597701,168.92434694478047C7.436781609195402,146.25435642593257,14.873563218390805,100.91437538823685,22.310344827586206,95.79121849151602C29.74712643678161,90.66806159479518,37.18390804597701,125.76172883904924,44.62068965517241,148.43554451237452C52.05747126436781,171.10936018569979,59.49425287356322,181.36332428809624,66.93103448275862,154.79975152842712C74.36781609195403,128.23617876875798,81.80459770114942,64.85506914702327,89.24137931034483,48.14211920096776C96.67816091954023,31.42916925491225,104.11494252873564,61.384378984535935,111.55172413793105,93.85781541177626C118.98850574712644,126.33125183901659,126.42528735632185,161.32291496387356,133.86206896551724,148.31313956909798C141.29885057471265,135.30336417432244,148.73563218390805,74.29215025991437,156.17241379310346,80.57305391179261C163.60919540229887,86.85395756367086,171.04597701149427,160.42697878183543,178.48275862068965,158.89394187072938C185.91954022988503,157.36090495962335,193.35632183908046,80.72180991924675,200.7931034482759,41.721809919246745C208.22988505747128,2.721809919246747,215.66666666666666,1.3609049596233735,223.1034482758621,28.845914931179916C230.54022988505747,56.330924902736456,237.97701149425288,112.66184980547291,245.41379310344826,120.9645601072351C252.85057471264363,129.2672704089973,260.28735632183907,89.54176610978521,267.7241379310345,96.98636675711906C275.1609195402299,104.43096740445289,282.5977011494253,159.04567299833263,290.0344827586207,170.83564913198418C297.4712643678161,182.62562526563576,304.9080459770115,151.59087193905907,312.3448275862069,153.39379474940336C319.7816091954023,155.1967175597476,327.21839080459773,189.8373165070128,334.65517241379314,194.73691437538824C342.09195402298855,199.6365122437637,349.5287356321839,174.79510903324942,356.9655172413793,154.98803413214762C364.4022988505747,135.18095923104585,371.83908045977006,120.40821263935658,379.2758620689655,97.18994997874915C386.71264367816093,73.97168731814169,394.1494252873563,42.30790858861608,401.5862068965518,55.398862261745194C409.02298850574715,68.4898159348743,416.4597701149425,126.33550201065812,423.8965517241379,163.00003269362801C431.3333333333333,199.6645633765979,438.7701149425288,215.14793866675384,446.2068965517241,208.64687612384344C453.64367816091954,202.1458135809331,461.08045977011494,173.66031320495634,468.5172413793104,138.87945859352013C475.95402298850576,104.09860398208389,483.3908045977011,63.02239513518814,490.8275862068965,55.92503351096871C498.2643678160919,48.82767188674927,505.7011494252874,75.70915748520613,513.1379310344828,95.29904861542487C520.5747126436781,114.88893974564358,528.0114942528736,127.18723640762416,535.448275862069,123.60731683394908C542.8850574712643,120.02739726027399,550.3218390804597,100.56926145094322,557.7586206896551,106.68950861477099C565.1954022988506,112.80975577859876,572.6321839080459,144.50838591558508,580.0689655172413,146.56886912740708C587.5057471264367,148.6293523392291,594.9425287356322,121.05168862588683,602.3793103448276,100.8914244613725C609.8160919540229,80.73116029685816,617.2528735632185,67.98829568117178,624.6896551724138,72.0098080884036C632.1264367816092,76.03132049563543,639.5632183908046,96.81720992578549,643.2816091954023,107.21015464086052L647,117.60309935593554"

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
                            // {...{ d: derivedD }}
                            d={d}
                        />
                    ) : (
                        <AnimatedPath
                            animatedProps={animatedProps}
                            fill="transparent"
                            stroke="#367be2"
                            strokeWidth={2}
                        />
                    )}
                    {/* <AnimatedPath
                        // ref={ref}
                        animatedProps={animatedProps}
                        fill="transparent"
                        stroke="#367be2"
                        strokeWidth={2}
                    /> */}
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
