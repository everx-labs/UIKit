import * as React from 'react';
import { View, Text } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';
import { debounce } from 'lodash';

function binaryIndexSearch(positions: number[], x: number) {
    'worklet';

    let left = 0;
    let right = positions.length;

    while (true) {
        const middle = left + Math.trunc((right - left) / 2);
        const item = positions[middle];

        if (x === item) {
            return left;
        }

        if (x > item) {
            left = middle;
        } else {
            right = middle;
        }

        if (right - left <= 1) {
            return left;
        }
    }
}

function calculateIsStable(xCoordinates: number[], xCoordsStableFlags: number) {
    'worklet';

    for (let i = 0; i < xCoordinates.length; i += 1) {
        // eslint-disable-next-line no-bitwise
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

function usePositions(itemsCount: number) {
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
    }

    const xCoordsStableFlags = React.useRef(0);

    const updateSharedContext = React.useCallback(
        debounce(() => {
            sharedContext.value = {
                positions: [...xCoords.current],
                isStable: calculateIsStable(xCoords.current, xCoordsStableFlags.current),
            };
        }),
        [],
    );

    const calculateCurrentPosition = React.useCallback(function calcCurrentPosition(x: number) {
        'worklet';

        if (!sharedContext.value.isStable) {
            return 0;
        }

        return binaryIndexSearch(sharedContext.value.positions, x);
    }, []);

    const onItemLayout = React.useCallback((index: number, value: number) => {
        'worklet';

        xCoords.current[index] = value;
        // eslint-disable-next-line no-bitwise
        xCoordsStableFlags.current |= 1 << index;

        updateSharedContext();
    }, []);

    return {
        calculateCurrentPosition,
        onItemLayout,
    };
}

export function Highlights() {
    const currentPosition = useSharedValue(0);

    const [index, setIndex] = React.useState(0);

    useAnimatedReaction(
        () => currentPosition.value,
        (cur, prev) => {
            if (cur === prev) {
                return;
            }
            runOnJS(setIndex)(cur);
        },
    );

    const { onItemLayout, calculateCurrentPosition } = usePositions(10);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll(event, _context) {
            const {
                contentOffset: { x },
            } = event;

            if (x == null) {
                return;
            }
            if (isNaN(x)) {
                return;
            }

            currentPosition.value = calculateCurrentPosition(x);
        },
    });

    return (
        <View style={{ position: 'relative' }}>
            <Animated.ScrollView
                horizontal
                onScrollBeginDrag={scrollHandler}
                scrollEventThrottle={16}
            >
                {new Array(10).fill(null).map((_, itemIndex) => (
                    <View
                        style={{
                            backgroundColor: 'red',
                            width: 100,
                            height: 100,
                            marginRight: 5,
                        }}
                        onLayout={({
                            nativeEvent: {
                                layout: { x },
                            },
                        }) => {
                            requestAnimationFrame(() => {
                                onItemLayout(itemIndex, x);
                            });
                        }}
                    />
                ))}
            </Animated.ScrollView>
            <View style={{ position: 'absolute', left: 0, top: 0 }}>
                <Text>{index}</Text>
            </View>
        </View>
    );
}
