import * as React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    runOnJS,
    scrollTo,
    SharedValue,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';
import { Dots } from './Dots';
import { usePositions } from './usePositions';

// @inline
const ADJUST_NONE = 0;
// @inline
const ADJUST_LEFT = 1;
// @inline
const ADJUST_RIGHT = 2;

type UIHighlightsContentInset = { left?: number; right?: number };

function DebugView({
    currentGravityPosition,
    contentInset,
}: {
    currentGravityPosition: SharedValue<number>;
    contentInset: UIHighlightsContentInset;
}) {
    const [index, setIndex] = React.useState(0);

    useAnimatedReaction(
        () => currentGravityPosition.value,
        (cur, prev) => {
            if (cur === prev || prev == null) {
                return;
            }
            runOnJS(setIndex)(cur);
        },
    );

    return (
        <View style={[styles.debugOverlay, { left: (contentInset.left ?? 0) + 10 }]}>
            <Text style={styles.debugPositionCount}>{index}</Text>
        </View>
    );
}

export function UIHighlightCard() {
    return (
        <View
            style={{
                backgroundColor: 'red',
                width: 150,
                height: 100,
                borderRadius: 10,
            }}
        />
    );
}

type UIHighlightsProps = {
    /**
     * Items of underlying ScrollView.
     * Be aware that though it was built for any children,
     * we still recommend to use pre-defined one,
     * see UIHighlightCard // TODO
     */
    children: React.ReactNode;
    /**
     * Space between children, doesn't apply for a first item.
     */
    spaceBetween?: number;
    /**
     * Space from edges to be applied from either left or right side.
     *
     * It's recommended to set `left` edge to more than 0, since it applies
     * visual feedback for items that are on the left side,
     * they will be visible for the size of the `left` property,
     * that make it clear for a user that there's a content to the left
     */
    contentInset?: UIHighlightsContentInset;
    /**
     * Whether debug view is visible
     */
    debug?: boolean;
};

/**
 * Works kind of like a https://reactnative.dev/docs/scrollview#pagingenabled
 * except it's made from scratch to unify behaviour on all platforms
 */
export function UIHighlights({
    children,
    spaceBetween = 0,
    debug = false,
    contentInset = { left: 0 },
}: UIHighlightsProps) {
    const currentGravityPosition = useSharedValue(0);
    const currentProgress = useSharedValue(0);

    const {
        onItemLayout,
        calculateCurrentPosition,
        calculateClosestX,
        calculateClosestLeftX,
        calculateClosestRightX,
    } = usePositions(React.Children.count(children));

    const scrollRef = useAnimatedRef<Animated.ScrollView>();

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
        },
    });

    const contentStyle = React.useMemo(
        () =>
            Object.keys(contentInset).reduce((acc, key) => {
                if (key === 'left' && contentInset.left != null) {
                    acc.paddingLeft = contentInset.left;
                }
                if (key === 'right' && contentInset.right != null) {
                    acc.paddingRight = contentInset.right;
                }
                return acc;
            }, {} as ViewStyle),
        [contentInset],
    );

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={scrollRef}
                horizontal
                onScrollBeginDrag={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={contentStyle}
                disableIntervalMomentum
                showsHorizontalScrollIndicator={false}
            >
                {React.Children.map(children, (child, itemIndex) => {
                    return (
                        <View
                            style={
                                itemIndex !== 0
                                    ? {
                                          paddingLeft: spaceBetween,
                                      }
                                    : null
                            }
                            onLayout={({
                                nativeEvent: {
                                    layout: { x },
                                },
                            }) => {
                                onItemLayout(
                                    itemIndex,
                                    // To have a visual feedback that
                                    // there are some items to the left
                                    // decrease the `x` coord by the `contentInset`
                                    // if it's present
                                    x - (contentInset.left ?? 0),
                                );
                            }}
                        >
                            {child}
                        </View>
                    );
                })}
            </Animated.ScrollView>
            {debug && (
                <DebugView
                    currentGravityPosition={currentGravityPosition}
                    contentInset={contentInset}
                />
            )}
            <View style={[styles.controlPanel, contentStyle]}>
                <Dots
                    currentProgress={currentProgress}
                    currentGravityPosition={currentGravityPosition}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: 'relative' },
    controlPanel: { flexDirection: 'row', marginTop: 8 },
    debugOverlay: {
        position: 'absolute',
        top: 3,
        padding: 3,
        borderRadius: 3,
        backgroundColor: 'rgba(0,0,0,.5)',
    },
    debugPositionCount: {
        color: 'white',
    },
});
