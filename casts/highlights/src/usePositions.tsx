/* eslint-disable no-bitwise */
import * as React from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { debounce } from 'lodash';
import { clamp } from 'react-native-redash';

function calculateIsStable(xCoordinates: number[], xCoordsStableFlags: number) {
    'worklet';

    for (let i = 0; i < xCoordinates.length; i += 1) {
        if ((xCoordsStableFlags & (1 << i)) === 0) {
            return false;
        }
    }
    return true;
}

type SharedContext = {
    positions: number[];
    isStable: boolean;
};

export function usePositions(
    itemsCount: number,
    scrollViewContentWidthShared: SharedValue<number>,
    isRrlShared: SharedValue<boolean>,
) {
    const sharedContext = useSharedValue<SharedContext>({
        positions: [],
        isStable: false,
    });

    const xCoords = React.useRef<number[]>([]);
    const lastItemsCount = React.useRef(0);

    if (itemsCount !== lastItemsCount.current) {
        xCoords.current = new Array(itemsCount).fill(null).map((c, i) => {
            if (xCoords.current[i] != null) {
                return xCoords.current[i];
            }
            return c;
        });
        lastItemsCount.current = itemsCount;
        sharedContext.value.isStable = false;
    }

    /**
     * I wanted to save on memory allocation
     * for such a small task, hence I use bit masks here,
     * since I doubt that there is going to be more than 62 items
     * (JS number should be 64 bits long, with 2 bits for negative numbers)
     */
    const xCoordsStableFlags = React.useRef(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateSharedContext = React.useCallback(
        debounce(() => {
            /**
             * We invert x-coordinate for RTL mode to simplify calculations
             */
            const positions = isRrlShared.value
                ? xCoords.current.map(coordinate => scrollViewContentWidthShared.value - coordinate)
                : xCoords.current.slice();
            sharedContext.value = {
                positions,
                isStable: calculateIsStable(xCoords.current, xCoordsStableFlags.current),
            };
        }),
        [],
    );

    const calculateProgress = React.useCallback(
        function calcProgress(position: number, x: number) {
            'worklet';

            const leftX = sharedContext.value.positions[position];
            const rightX = sharedContext.value.positions[position + 1];
            return (x - leftX) / (rightX - leftX);
        },
        [sharedContext],
    );

    const calculateCurrentPosition = React.useCallback(
        function calculateCurrentPosition(
            rawX: number,
            gravityPosition: number,
        ): { gravityPosition: number; progress: number } {
            'worklet';

            if (!sharedContext.value.isStable) {
                return {
                    gravityPosition: 0,
                    progress: 0,
                };
            }

            const maxPosition = sharedContext.value.positions.length - 1;
            const x = clamp(
                rawX,
                sharedContext.value.positions[0],
                sharedContext.value.positions[maxPosition],
            );

            /**
             * In highlights we want to know what the "position" of the left edge of
             * the visible area in ScrollView is regarding to items coordinates.
             * Each item (aka a highlight card) has an X coordinate, that we collect on mount.
             *
             * How would one detect the "position" that the left edge represents?
             *
             * Simple solution would be to map the X coordinate of the left edge (aka `contentOffset.x`)
             * to the ones we gathered before.
             * Imagine we have 4 items that have following X coords: [0, 100, 300, 450].
             * Now imagine we scroll highlights and got X = 50, then the current "position" is 0
             * If X = 150, then the "position" = 1, if X = 350, then the "position" = 2 and so on.
             *
             * It works ok if one moves to the right,
             * since "position" changes when the item is completely gone to the left.
             * But it works differently when one moves to the left.
             * Then as soon the item is slightly visible, "position" changes,
             * even though it's not visible yet.
             *
             * To solve that "gravity position" was introduced.
             * Basically it brings "current position" (previous state) to the algorithm.
             * Let's revise previous example to show how it works,
             * so we have the same coords: [0, 100, 300, 450].
             * Now imagine we moved to X = 100, that means that we have a "gravity position" as 1.
             * For that "position" we have two intervals to closest "positions":
             * 1. [0, 100]
             * 2. [100, 300]
             *
             * Now if we move either to the left or right and X falls into this intervals,
             * we DON'T change the "current position".
             * i.e.
             * - current position = 1, X = 50, next position = 1
             * - current position = 1, X = 200, next position = 1
             * as soon as X doesn't fall to the intervals,
             * we change "gravity position" to the closest point,
             * (note: it's not actually how it's done,
             *  since in reality scroll events are fired very fast
             *  and it almost impossible to "jump" over big distances,
             *  so we just increase or decrease gravity position)
             * for example if X = 350, then we change "gravity position" to 2
             * and continue next calculations with it.
             */
            const previousGravityPosition = Math.max(0, gravityPosition - 1);
            const nextGravityPosition = Math.min(maxPosition, gravityPosition + 1);

            const previousX = sharedContext.value.positions[previousGravityPosition];
            const nextX = sharedContext.value.positions[nextGravityPosition];

            if (x > previousX && x < nextX) {
                const middleX = sharedContext.value.positions[gravityPosition];
                if (x === middleX) {
                    return {
                        gravityPosition,
                        progress: 0,
                    };
                }
                if (x < middleX) {
                    const progress = -1 * (1 - calculateProgress(previousGravityPosition, x));
                    return {
                        gravityPosition,
                        progress,
                    };
                }
                const progress = calculateProgress(gravityPosition, x);
                return {
                    gravityPosition,
                    progress,
                };
            }
            if (x === previousX) {
                return {
                    gravityPosition: previousGravityPosition,
                    progress: 0,
                };
            }
            if (x === nextX) {
                return {
                    gravityPosition: nextGravityPosition,
                    progress: 0,
                };
            }
            if (x < previousX) {
                if (previousGravityPosition === gravityPosition) {
                    return {
                        gravityPosition,
                        progress: 0,
                    };
                }

                return calculateCurrentPosition(x, previousGravityPosition);
            }
            // x > nextX
            if (nextGravityPosition === gravityPosition) {
                return {
                    gravityPosition,
                    progress: 0,
                };
            }
            return calculateCurrentPosition(x, nextGravityPosition);
        },
        [calculateProgress, sharedContext],
    );

    const calculateClosestPreviousX = React.useCallback(
        function calcClosestPosition(gravityPosition: number) {
            'worklet';

            if (!sharedContext.value.isStable) {
                return 0;
            }

            /**
             * positions was inverted to simplify calculations.
             * So we need to re-invert them.
             */
            return (
                sharedContext.value.positions[Math.max(0, gravityPosition - 1)] *
                (isRrlShared.value ? -1 : 1)
            );
        },
        [isRrlShared, sharedContext],
    );

    const calculateClosestNextX = React.useCallback(
        function calcClosestPosition(gravityPosition: number) {
            'worklet';

            if (!sharedContext.value.isStable) {
                return 0;
            }

            const maxPosition = sharedContext.value.positions.length - 1;

            /**
             * positions was inverted to simplify calculations.
             * So we need to re-invert them.
             */
            return (
                sharedContext.value.positions[Math.min(maxPosition, gravityPosition + 1)] *
                (isRrlShared.value ? -1 : 1)
            );
        },
        [isRrlShared, sharedContext],
    );

    const calculateClosestX = React.useCallback(
        function calcClosestPosition(x: number, gravityPosition: number) {
            'worklet';

            const { progress } = calculateCurrentPosition(x, gravityPosition);

            if (progress === 0 || Math.abs(progress) < 0.5) {
                return sharedContext.value.positions[gravityPosition];
            }
            if (progress < -0.5) {
                return calculateClosestPreviousX(gravityPosition);
            }
            return calculateClosestNextX(gravityPosition);
        },
        [sharedContext, calculateClosestPreviousX, calculateClosestNextX, calculateCurrentPosition],
    );

    const onItemLayout = React.useCallback(
        (index: number, value: number) => {
            'worklet';

            xCoords.current[index] = value;
            xCoordsStableFlags.current |= 1 << index;

            updateSharedContext();
        },
        [updateSharedContext],
    );

    return {
        calculateCurrentPosition,
        calculateClosestX,
        calculateClosestPreviousX,
        calculateClosestNextX,
        onItemLayout,
    };
}
