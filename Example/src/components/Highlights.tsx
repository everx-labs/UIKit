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

    const calculateProgress = React.useCallback(function calcProgress(position: number, x: number) {
        'worklet';

        const leftX = sharedContext.value.positions[position];
        const rightX = sharedContext.value.positions[position + 1];
        return (x - leftX) / (rightX - leftX);
    }, []);

    const calculateCurrentPosition = React.useCallback(function calcCurrentPosition(
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

            return calcCurrentPosition(x, left);
        }
        // x > rightX
        if (right === gravityPosition) {
            return {
                gravityPosition,
                progress: 0,
            };
        }
        return calcCurrentPosition(x, right);
    },
    []);

    const calculateClosestLeftX = React.useCallback(function calcClosestPosition(
        gravityPosition: number,
    ) {
        'worklet';

        if (!sharedContext.value.isStable) {
            return 0;
        }

        return sharedContext.value.positions[Math.max(0, gravityPosition - 1)];
    },
    []);

    const calculateClosestRightX = React.useCallback(function calcClosestPosition(
        gravityPosition: number,
    ) {
        'worklet';

        if (!sharedContext.value.isStable) {
            return 0;
        }

        const maxPosition = sharedContext.value.positions.length - 1;
        return sharedContext.value.positions[Math.min(maxPosition, gravityPosition + 1)];
    },
    []);

    const calculateClosestX = React.useCallback(function calcClosestPosition(
        x: number,
        gravityPosition: number,
    ) {
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
        calculateClosestX,
        calculateClosestLeftX,
        calculateClosestRightX,
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
    const currentGravityPosition = useSharedValue(0);

    const currentProgress = useSharedValue(0);

    const [index, setIndex] = React.useState(0);

    const dotsContext = useSharedValue({
        slots: [1, 2, 3, 4, 5],
        activeIndex: 1,
    });
    const dotProgress = useDerivedValue(() => {
        let progress = 0;

        if (dotsContext.value.activeIndex === 1 && currentProgress.value < 0) {
            progress = currentProgress.value;
        }
        if (dotsContext.value.activeIndex === 3 && currentProgress.value > 0) {
            progress = currentProgress.value;
        }

        return progress;
    });

    useAnimatedReaction(
        () => currentGravityPosition.value,
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
            dotsContext.value = newDotsContext;
        },
    );

    const {
        onItemLayout,
        calculateCurrentPosition,
        calculateClosestX,
        calculateClosestLeftX,
        calculateClosestRightX,
    } = usePositions(10);

    const scrollRef = useAnimatedRef();

    const scrollHandler = useAnimatedScrollHandler<{ adjustOnMomentum: number }>({
        onScroll(event) {
            const {
                contentOffset: { x },
            } = event;

            if (x == null || isNaN(x)) {
                return;
            }

            const { gravityPosition, progress } = calculateCurrentPosition(
                x,
                currentGravityPosition.value,
            );
            currentGravityPosition.value = gravityPosition;
            currentProgress.value = progress;
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

            const closestX = calculateClosestX(x, currentGravityPosition.value);
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

            let closestX = 0;

            if (ctx.adjustOnMomentum === ADJUST_LEFT) {
                closestX = calculateClosestLeftX(currentGravityPosition.value);
            } else if (ctx.adjustOnMomentum === ADJUST_RIGHT) {
                closestX = calculateClosestRightX(currentGravityPosition.value);
            } else {
                closestX = calculateClosestX(x, currentGravityPosition.value);
            }

            scrollTo(scrollRef, closestX, 0, true);
            // currentPosition.value = calculateCurrentPosition(closestX);
        },
    });

    const activeDotId = useDerivedValue(() => {
        return dotsContext.value.slots[dotsContext.value.activeIndex];
    });

    const dotsWrappers = React.useRef<Record<number, ReturnType<typeof useAnimatedStyle>>>({});
    const dots = React.useRef<Record<number, ReturnType<typeof useAnimatedStyle>>>({});
    for (let i = 0; i < dotsContext.value.slots.length; i += 1) {
        const id = i + 1;
        dotsWrappers.current[id] = useAnimatedStyle(() => {
            const placement = dotsContext.value.slots.findIndex(it => it === id) + 1;

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
            return {
                backgroundColor: activeDotId.value === id ? 'white' : 'rgba(0,0,0,.2)',
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
