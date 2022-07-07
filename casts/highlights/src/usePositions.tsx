/* eslint-disable no-bitwise */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { debounce } from 'lodash';

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

export function usePositions(itemsCount: number) {
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
            sharedContext.value = {
                positions: [...xCoords.current],
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
            const x = Math.min(
                sharedContext.value.positions[maxPosition],
                Math.max(sharedContext.value.positions[0], rawX),
            );

            /**
             * This is why it's called "gravity position",
             * instead of counting position based on a left edge of an item
             * (i.e. x coordinate of a View frame) (this is actually was my first solution)
             * we treat that left edge as a gravity point.
             *
             * That means that we don't calculate current position
             * based on between what coordinates the current X is,
             * but rather we set a new gravity point only when progress
             * (difference between current gravity point X and either left or right X)
             * exceeds 1.
             *
             * That helps with movement to the left,
             * since we change position only when the left card is fully visible.
             */
            const left = Math.max(0, gravityPosition - 1);
            const right = Math.min(maxPosition, gravityPosition + 1);

            const leftX = sharedContext.value.positions[left];
            const rightX = sharedContext.value.positions[right];

            if (x > leftX && x < rightX) {
                const middleX = sharedContext.value.positions[gravityPosition];
                if (x === middleX) {
                    return {
                        gravityPosition,
                        progress: 0,
                    };
                }
                if (x < middleX) {
                    const progress = -1 * (1 - calculateProgress(left, x));
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
            if (x === leftX) {
                return {
                    gravityPosition: left,
                    progress: 0,
                };
            }
            if (x === rightX) {
                return {
                    gravityPosition: right,
                    progress: 0,
                };
            }
            if (x < leftX) {
                if (left === gravityPosition) {
                    return {
                        gravityPosition,
                        progress: 0,
                    };
                }

                return calculateCurrentPosition(x, left);
            }
            // x > rightX
            if (right === gravityPosition) {
                return {
                    gravityPosition,
                    progress: 0,
                };
            }
            return calculateCurrentPosition(x, right);
        },
        [calculateProgress, sharedContext],
    );

    const calculateClosestLeftX = React.useCallback(
        function calcClosestPosition(gravityPosition: number) {
            'worklet';

            if (!sharedContext.value.isStable) {
                return 0;
            }

            return sharedContext.value.positions[Math.max(0, gravityPosition - 1)];
        },
        [sharedContext],
    );

    const calculateClosestRightX = React.useCallback(
        function calcClosestPosition(gravityPosition: number) {
            'worklet';

            if (!sharedContext.value.isStable) {
                return 0;
            }

            const maxPosition = sharedContext.value.positions.length - 1;
            return sharedContext.value.positions[Math.min(maxPosition, gravityPosition + 1)];
        },
        [sharedContext],
    );

    const calculateClosestX = React.useCallback(
        function calcClosestPosition(x: number, gravityPosition: number) {
            'worklet';

            const { progress } = calculateCurrentPosition(x, gravityPosition);

            if (progress === 0 || Math.abs(progress) < 0.5) {
                return sharedContext.value.positions[gravityPosition];
            }
            if (progress < -0.5) {
                return calculateClosestLeftX(gravityPosition);
            }
            return calculateClosestRightX(gravityPosition);
        },
        [sharedContext, calculateClosestLeftX, calculateClosestRightX, calculateCurrentPosition],
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
        calculateClosestLeftX,
        calculateClosestRightX,
        onItemLayout,
    };
}
