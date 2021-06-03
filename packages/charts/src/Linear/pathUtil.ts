import Animated, { interpolate, Extrapolate } from 'react-native-reanimated';
import type { Path as RedashPath } from 'react-native-redash';
import type { Point, Dimensions } from './LinearChart';

export const scale = (value: number, domain: number[], range: number[]) => {
    'worklet';

    return interpolate(value, domain, range, Extrapolate.CLAMP);
};

export const getScaledData = (
    data: Point[],
    dimensions: Dimensions,
): Point[] => {
    'worklet';

    const domain = {
        x: [
            Math.min(...data.map(({ x }) => x)),
            Math.max(...data.map(({ x }) => x)),
        ],
        y: [
            Math.min(...data.map(({ y }) => y)),
            Math.max(...data.map(({ y }) => y)),
        ],
    };
    const range = {
        x: [0, dimensions.width],
        y: [dimensions.height, 0],
    };

    return data.map(
        (point: Point): Point => {
            return {
                x: scale(point.x, domain.x, range.x),
                y: scale(point.y, domain.y, range.y),
            };
        },
    );
};

export const createPath = (move: Point): RedashPath => {
    'worklet';

    return {
        move,
        curves: [],
        close: false,
    };
};

const getCurve = (currentPoint: Point, p0: Point, p1: Point) => {
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
        to: { x: cp3x, y: cp3y },
    };
};

export const curveLines = (points: Point[]) => {
    'worklet';

    const path = createPath(points[0]);
    for (let i = 0; i < points.length; i += 1) {
        if (i === 0) {
            continue;
        }
        const currentPoint = points[i];
        const prevtPoint = points[i - 1];

        const p0 = points[i - 2] || prevtPoint;
        const p1 = points[i - 1];

        path.curves.push(getCurve(currentPoint, p0, p1));
        if (i === points.length - 1) {
            const p2 = points[i - 1];
            const p3 = points[i];
            path.curves.push(getCurve(currentPoint, p2, p3));
        }
    }
    return path;
};

export const convertDataToPath = (
    data: Point[],
    dimensions: Dimensions,
): RedashPath => {
    'worklet';

    const scaledData: Point[] = getScaledData(data, dimensions);
    return curveLines(scaledData);
};

/**
 * @worklet
 */
export const interpolatePathCustom = (
    value: number,
    inputRange: number[],
    outputRange: RedashPath[],
    extrapolate = Animated.Extrapolate.CLAMP,
): RedashPath => {
    'worklet';

    const path = {
        move: {
            x: interpolate(
                value,
                inputRange,
                outputRange.map((p) => p.move.x),
                extrapolate,
            ),
            y: interpolate(
                value,
                inputRange,
                outputRange.map((p) => p.move.y),
                extrapolate,
            ),
        },
        curves: outputRange[0].curves.map((_, index) => ({
            c1: {
                x: interpolate(
                    value,
                    inputRange,
                    outputRange.map((p) => p.curves[index].c1.x),
                    extrapolate,
                ),
                y: interpolate(
                    value,
                    inputRange,
                    outputRange.map((p) => p.curves[index].c1.y),
                    extrapolate,
                ),
            },
            c2: {
                x: interpolate(
                    value,
                    inputRange,
                    outputRange.map((p) => p.curves[index].c2.x),
                    extrapolate,
                ),
                y: interpolate(
                    value,
                    inputRange,
                    outputRange.map((p) => p.curves[index].c2.y),
                    extrapolate,
                ),
            },
            to: {
                x: interpolate(
                    value,
                    inputRange,
                    outputRange.map((p) => p.curves[index].to.x),
                    extrapolate,
                ),
                y: interpolate(
                    value,
                    inputRange,
                    outputRange.map((p) => p.curves[index].to.y),
                    extrapolate,
                ),
            },
        })),
        close: outputRange[0].close,
    };
    return path;
};
