import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    scrollTo,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
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
            return middle;
        }

        if (x >= item) {
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

        const position = binaryIndexSearch(sharedContext.value.positions, x);
        const leftX = sharedContext.value.positions[position];
        const rightX = sharedContext.value.positions[position + 1];
        const progress = (x - leftX) / (rightX - leftX);
        return position + progress;
    }, []);

    const calculateClosestPosition = React.useCallback(function calcClosestPosition(x: number) {
        'worklet';

        if (!sharedContext.value.isStable) {
            return 0;
        }

        const closesLeftPosition = binaryIndexSearch(sharedContext.value.positions, x);
        const leftX = sharedContext.value.positions[closesLeftPosition];
        const rightX = sharedContext.value.positions[closesLeftPosition + 1];
        const middleX = leftX + Math.trunc((rightX - leftX) / 2);

        if (x < middleX) {
            return leftX;
        }
        return rightX;
    }, []);

    const calculateClosestLeftPosition = React.useCallback(function calcClosestPosition(x: number) {
        'worklet';

        if (!sharedContext.value.isStable) {
            return 0;
        }

        const closesLeftPosition = binaryIndexSearch(sharedContext.value.positions, x);
        const leftX = sharedContext.value.positions[closesLeftPosition];

        return leftX;
    }, []);

    const calculateClosestRightPosition = React.useCallback(function calcClosestPosition(
        x: number,
    ) {
        'worklet';

        if (!sharedContext.value.isStable) {
            return 0;
        }

        const closesLeftPosition = binaryIndexSearch(sharedContext.value.positions, x);
        const rightX = sharedContext.value.positions[closesLeftPosition + 1];

        return rightX;
    },
    []);

    const onItemLayout = React.useCallback((index: number, value: number) => {
        'worklet';

        xCoords.current[index] = value;
        // eslint-disable-next-line no-bitwise
        xCoordsStableFlags.current |= 1 << index;

        updateSharedContext();
    }, []);

    return {
        calculateCurrentPosition,
        calculateClosestPosition,
        calculateClosestLeftPosition,
        calculateClosestRightPosition,
        onItemLayout,
    };
}

// @inline
const ADJUST_NONE = 0;
// @inline
const ADJUST_LEFT = 1;
// @inline
const ADJUST_RIGHT = 2;

function rotateDots(slots: number[], activeIndex: number, direction: number) {
    'worklet';

    const tempDots = [...slots];
    let index = activeIndex;

    if (direction < 0) {
        index -= 1;
        if (index < 1) {
            index = 1;
            const last = tempDots.pop();
            tempDots.unshift(last as number);
        }
    } else {
        index += 1;
        if (index > tempDots.length - 2) {
            index = tempDots.length - 2;
            const first = tempDots.shift();
            tempDots.push(first as number);
        }
    }

    return {
        slots: tempDots,
        activeIndex: index,
    };
}

export function Highlights() {
    const prevPosition = useSharedValue(-1);
    const currentPosition = useSharedValue(0);

    useAnimatedReaction(
        () => currentPosition.value,
        (cur, prev) => {
            if (prev == null || cur === prev) {
                return;
            }
            prevPosition.value = prev;
        },
    );

    const currentProgress = useSharedValue(0);

    const [index, setIndex] = React.useState(0);

    const prevDotsContext = useSharedValue({
        slots: [1, 2, 3, 4, 5],
        activeIndex: 1,
    });
    const dotsContext = useSharedValue({
        slots: [1, 2, 3, 4, 5],
        activeIndex: 1,
    });
    const dotsIndexes = useDerivedValue(() => {
        // if (prevPosition.value > currentPosition.value && currentProgress.value > 0) {
        //     return prevDotsContext.value.slots;
        // }
        return dotsContext.value.slots;
    });
    const activeDotIndex = useDerivedValue(() => {
        if (prevPosition.value > currentPosition.value && currentProgress.value > 0) {
            return dotsContext.value.activeIndex + 1;
        }
        return dotsContext.value.activeIndex;
    });
    const dotProgress = useDerivedValue(() => {
        let progress = 0;

        if (prevPosition.value > currentPosition.value && dotsContext.value.activeIndex === 1) {
            progress = currentProgress.value;
        }
        if (prevPosition.value < currentPosition.value && dotsContext.value.activeIndex === 3) {
            progress = currentProgress.value;
        }

        return progress;
    });

    useAnimatedReaction(
        () => currentPosition.value,
        (cur, prev) => {
            if (cur === prev || prev == null) {
                return;
            }
            runOnJS(setIndex)(cur);
            const direction = cur - prev;
            const newDotsContext = rotateDots(
                dotsContext.value.slots,
                dotsContext.value.activeIndex,
                direction,
            );
            prevDotsContext.value = dotsContext.value;
            dotsContext.value = newDotsContext;
        },
    );

    const {
        onItemLayout,
        calculateCurrentPosition,
        calculateClosestPosition,
        calculateClosestLeftPosition,
        calculateClosestRightPosition,
    } = usePositions(10);

    const scrollRef = useAnimatedRef();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll(event) {
            const {
                contentOffset: { x },
            } = event;

            if (x == null || isNaN(x)) {
                return;
            }

            const positionProgress = calculateCurrentPosition(x);
            const position = Math.trunc(positionProgress);
            currentPosition.value = position;
            currentProgress.value = positionProgress - position;
        },
        onEndDrag(event, ctx) {
            const {
                contentOffset: { x },
                velocity,
            } = event;

            if (velocity != null) {
                if (velocity.x > 0) {
                    ctx.adjustOnMomentum = ADJUST_RIGHT;
                    return;
                }
                if (velocity.x < 0) {
                    ctx.adjustOnMomentum = ADJUST_LEFT;
                    return;
                }
            }

            ctx.adjustOnMomentum = ADJUST_NONE;

            if (x == null || isNaN(x)) {
                return;
            }

            const closestX = calculateClosestPosition(x);
            scrollTo(scrollRef, closestX, 0, true);
            // currentPosition.value = calculateCurrentPosition(closestX);
        },
        onMomentumBegin(event, ctx) {
            const {
                contentOffset: { x },
            } = event;

            if (ctx.adjustOnMomentum === ADJUST_NONE) {
                return;
            }

            if (x == null || isNaN(x)) {
                return;
            }

            let closestX = 0;

            if (ctx.adjustOnMomentum === ADJUST_LEFT) {
                closestX = calculateClosestLeftPosition(x);
            } else if (ctx.adjustOnMomentum === ADJUST_RIGHT) {
                closestX = calculateClosestRightPosition(x);
            } else {
                closestX = calculateClosestPosition(x);
            }

            scrollTo(scrollRef, closestX, 0, true);
            // currentPosition.value = calculateCurrentPosition(closestX);
        },
    });

    const dotsWrappers = React.useRef<Record<number, ReturnType<typeof useAnimatedStyle>>>({});
    const dots = React.useRef<Record<number, ReturnType<typeof useAnimatedStyle>>>({});
    for (let i = 0; i < dotsIndexes.value.length; i += 1) {
        const id = i + 1;
        dotsWrappers.current[id] = useAnimatedStyle(() => {
            const placement = dotsIndexes.value.findIndex(it => it === id) + 1;

            return {
                transform: [
                    {
                        translateX: interpolate(
                            placement - dotProgress.value,
                            [0, 1, 2, 3, 4, 5, 6],
                            [-32, -16, 0, 16, 32, 48, 64],
                            Extrapolate.CLAMP,
                        ),
                    },
                ],
            };
        });
        dots.current[id] = useAnimatedStyle(() => {
            const activeId = dotsIndexes.value[activeDotIndex.value];
            // console.log(id, activeId, dotsIndexes.value, activeId === id);

            return {
                backgroundColor: activeId === id ? 'white' : 'rgba(0,0,0,.2)',
            };
        });
    }

    return (
        <View style={{ position: 'relative' }}>
            <Animated.ScrollView
                ref={scrollRef}
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
                            onItemLayout(itemIndex, x);
                        }}
                    />
                ))}
            </Animated.ScrollView>
            <View style={{ position: 'absolute', left: 0, top: 0 }}>
                <Text>{index}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View
                    style={{
                        overflow: 'hidden',
                        position: 'relative',
                        borderRadius: 12,
                        backgroundColor: 'grey',
                        width: 16 * 3 + 6 * 2,
                        height: 24,
                        paddingHorizontal: 6,
                        flexDirection: 'row',
                    }}
                >
                    <Animated.View style={[styles.dotWrapper, dotsWrappers.current[1]]}>
                        <Animated.View style={[styles.dot, dots.current[1]]} />
                    </Animated.View>
                    <Animated.View style={[styles.dotWrapper, dotsWrappers.current[2]]}>
                        <Animated.View style={[styles.dot, dots.current[2]]} />
                    </Animated.View>
                    <Animated.View style={[styles.dotWrapper, dotsWrappers.current[3]]}>
                        <Animated.View style={[styles.dot, dots.current[3]]} />
                    </Animated.View>
                    <Animated.View style={[styles.dotWrapper, dotsWrappers.current[4]]}>
                        <Animated.View style={[styles.dot, dots.current[4]]} />
                    </Animated.View>
                    <Animated.View style={[styles.dotWrapper, dotsWrappers.current[5]]}>
                        <Animated.View style={[styles.dot, dots.current[5]]} />
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dotWrapper: {
        width: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});
