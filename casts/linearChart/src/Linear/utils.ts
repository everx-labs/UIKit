import Animated, { interpolate, Extrapolate } from 'react-native-reanimated';
import type { Path } from 'react-native-redash';
import { uiLocalized } from '@tonlabs/localization';
import type {
    LinearChartPoint,
    LinearChartDimensions,
    LinearChartExtremum,
    LinearChartControlPoints,
} from './types';

/**
 * @worklet
 */
const scale = (value: number, domain: number[], range: number[]) => {
    'worklet';

    return interpolate(value, domain, range, Extrapolate.CLAMP);
};

/**
 * @worklet
 */
export const getScaledData = (
    data: LinearChartPoint[],
    dimensions: LinearChartDimensions,
): LinearChartPoint[] | null => {
    'worklet';

    if (dimensions.height === 0 || dimensions.width === 0) {
        return null;
    }

    // Find the min and max values for x, y
    let xMin: number | undefined;
    let xMax: number | undefined;
    let yMin: number | undefined;
    let yMax: number | undefined;

    data.forEach(({ x, y }) => {
        if (xMin == null || x < xMin) {
            xMin = x;
        }
        if (xMax == null || x > xMax) {
            xMax = x;
        }
        if (yMin == null || y < yMin) {
            yMin = y;
        }
        if (yMax == null || y > yMax) {
            yMax = y;
        }
    });

    if (xMin == null || xMax == null || yMin == null || yMax == null) {
        // Data array seems to be empty
        return null;
    }

    const domain = {
        x: [xMin, xMax],
        y: [yMin, yMax],
    };
    const range = {
        x: [0, dimensions.width],
        y: [dimensions.height, 0],
    };

    return data.map((point: LinearChartPoint): LinearChartPoint => {
        return {
            x: scale(point.x, domain.x, range.x),
            y: scale(point.y, domain.y, range.y),
        };
    });
};

const getExtremum = (
    data: LinearChartPoint[],
    scaledData: LinearChartPoint[],
): LinearChartExtremum => {
    'worklet';

    let minimumPoint: LinearChartPoint = data[0];
    let minimumScaledPoint: LinearChartPoint = scaledData[0];
    let maximumPoint: LinearChartPoint = data[0];
    let maximumScaledPoint: LinearChartPoint = scaledData[0];
    for (let i = 0; i < data.length; i += 1) {
        if (data[i].y < minimumPoint.y) {
            minimumPoint = data[i];
            minimumScaledPoint = scaledData[i];
        }
        if (data[i].y > maximumPoint.y) {
            maximumPoint = data[i];
            maximumScaledPoint = scaledData[i];
        }
    }
    return {
        minimumPoint,
        minimumScaledPoint,
        maximumPoint,
        maximumScaledPoint,
    };
};

export const getControlPoints = (
    data: LinearChartPoint[],
    scaledData: LinearChartPoint[] | null,
    curveWidth: number,
): LinearChartControlPoints | null => {
    'worklet';

    if (scaledData === null) {
        return null;
    }

    const extremum: LinearChartExtremum = getExtremum(data, scaledData);
    return {
        start: {
            value: data[0].y,
            x: scaledData[0].x + curveWidth / 2,
            y: scaledData[0].y + curveWidth / 2,
        },
        end: {
            value: data[data.length - 1].y,
            x: scaledData[scaledData.length - 1].x + curveWidth / 2,
            y: scaledData[scaledData.length - 1].y + curveWidth / 2,
        },
        minimum: {
            value: extremum.minimumPoint.y,
            x: extremum.minimumScaledPoint.x,
            y: extremum.minimumScaledPoint.y,
        },
        maximum: {
            value: extremum.maximumPoint.y,
            x: extremum.maximumScaledPoint.x,
            y: extremum.maximumScaledPoint.y,
        },
    };
};

/**
 * @worklet
 * Was copied from `react-native-redash/Paths`
 */
const createPath = (move: LinearChartPoint): Path => {
    'worklet';

    return {
        move,
        curves: [],
        close: false,
    };
};

/**
 * @worklet
 * Was copied from `react-native-redash/Paths`
 */
const getCurve = (
    currentPoint: LinearChartPoint,
    p0: LinearChartPoint,
    p1: LinearChartPoint,
    isLastPoint: boolean,
) => {
    'worklet';

    const cp1x = (2 * p0.x + p1.x) / 3;
    const cp1y = (2 * p0.y + p1.y) / 3;
    const cp2x = (p0.x + 2 * p1.x) / 3;
    const cp2y = (p0.y + 2 * p1.y) / 3;
    const cp3x = (p0.x + 4 * p1.x + currentPoint.x) / 6;
    const cp3y = (p0.y + 4 * p1.y + currentPoint.y) / 6;
    return {
        c1: { x: cp1x, y: cp1y },
        c2: { x: cp2x, y: cp2y },
        to: isLastPoint ? currentPoint : { x: cp3x, y: cp3y },
    };
};

/**
 * Functions `createPath`, `getCurve` and `curveLines`
 * were copied from `react-native-redash/Paths` package
 * because the `curveLines` function does not behave as expected
 * (The curve between the second to last and last point is always straight.)
 * and had to be changed.
 */

/**
 * @worklet
 * Was copied from `react-native-redash/Paths` and changed
 */
const curveLines = (points: LinearChartPoint[]) => {
    'worklet';

    const path = createPath(points[0]);
    for (let i = 0; i < points.length; i += 1) {
        if (i === 0) {
            continue;
        }
        const currentPoint = points[i];
        const previousPoint = points[i - 1];
        const p0 = points[i - 2] || previousPoint;

        path.curves.push(getCurve(currentPoint, p0, previousPoint, false));

        if (i === points.length - 1) {
            path.curves.push(getCurve(currentPoint, previousPoint, currentPoint, true));
        }
    }
    return path;
};

/**
 * @worklet
 * used so that the curve is not clipped
 */
const getMovedPointByHalfCurveWidth = (curveWidth: number) => {
    'worklet';

    return (point: LinearChartPoint): LinearChartPoint => {
        'worklet';

        return {
            x: point.x + curveWidth / 2,
            y: point.y + curveWidth / 2,
        };
    };
};

/**
 * @worklet
 */
export const convertDataToPath = (
    data: LinearChartPoint[],
    dimensions: LinearChartDimensions,
    curveWidth: number,
): Path | null => {
    'worklet';

    const scaledData: LinearChartPoint[] | null = getScaledData(data, dimensions);
    if (scaledData === null) {
        return null;
    }
    const movedScaledData: LinearChartPoint[] = scaledData.map(
        getMovedPointByHalfCurveWidth(curveWidth),
    );
    return curveLines(movedScaledData);
};

/**
 * @worklet
 * Was copied from `react-native-redash/Paths` and changed
 * (the function must return Path)
 */
export const interpolatePath = (
    value: number,
    inputRange: number[],
    outputRange: Path[],
    extrapolate = Animated.Extrapolate.CLAMP,
): Path => {
    'worklet';

    const path = {
        move: {
            x: interpolate(
                value,
                inputRange,
                outputRange.map(p => p.move.x),
                extrapolate,
            ),
            y: interpolate(
                value,
                inputRange,
                outputRange.map(p => p.move.y),
                extrapolate,
            ),
        },
        curves: outputRange[0].curves.map((_, index) => ({
            c1: {
                x: interpolate(
                    value,
                    inputRange,
                    outputRange.map(p => p.curves[index].c1.x),
                    extrapolate,
                ),
                y: interpolate(
                    value,
                    inputRange,
                    outputRange.map(p => p.curves[index].c1.y),
                    extrapolate,
                ),
            },
            c2: {
                x: interpolate(
                    value,
                    inputRange,
                    outputRange.map(p => p.curves[index].c2.x),
                    extrapolate,
                ),
                y: interpolate(
                    value,
                    inputRange,
                    outputRange.map(p => p.curves[index].c2.y),
                    extrapolate,
                ),
            },
            to: {
                x: interpolate(
                    value,
                    inputRange,
                    outputRange.map(p => p.curves[index].to.x),
                    extrapolate,
                ),
                y: interpolate(
                    value,
                    inputRange,
                    outputRange.map(p => p.curves[index].to.y),
                    extrapolate,
                ),
            },
        })),
        close: outputRange[0].close,
    };
    return path;
};

export const negateProgressTarget = (progressTarget: number): number => {
    'worklet';

    return progressTarget ? 0 : 1;
};

export const formatLabelText = (value: number | null) => {
    /**
     * `isLocalized: false` because in a non-English localization,
     * it is possible that either the labels will be cutted
     * or the chart will be too narrow.
     * @TODO fix the UI for working with labels so that they fit regardless of localization
     */
    return uiLocalized.shortenAmount(value, {
        fractionalDigits: 2,
        isLocalized: false,
    });
};
