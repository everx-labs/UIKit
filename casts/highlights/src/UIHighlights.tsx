import * as React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
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
import { useOnWheelHandler } from './useOnWheelHandler';
import { WebPositionControl } from './WebPositionControls';
import { runOnUIPlatformSelect } from './runOnUIPlatformSelect';

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
     * Mobile only
     *
     * Whether items should stick to the left edge
     * after drag was end.
     *
     * Default - false
     *
     * Doesn't work on the web due to macos scroll inertia problem
     * On Android doesn't work due to that `fling` isn't stopped by `scrollTo`
     */
    pagingEnabled?: boolean;
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
    pagingEnabled = false,
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

    type ScrollContext = { adjustOnMomentum: number };
    const scrollHandler = useAnimatedScrollHandler<ScrollContext>({
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
            if (!pagingEnabled) {
                ctx.adjustOnMomentum = ADJUST_NONE;
                return;
            }
            const { contentOffset, velocity } = event;

            // On web we actually don't pass `contentOffset` object
            // see `useOnWheelHandler`
            const { x } = contentOffset || {};

            if (velocity != null) {
                if (velocity.x > 0) {
                    ctx.adjustOnMomentum = runOnUIPlatformSelect({
                        android: ADJUST_LEFT,
                        default: ADJUST_RIGHT,
                    });

                    return;
                }
                if (velocity.x < 0) {
                    ctx.adjustOnMomentum = runOnUIPlatformSelect({
                        android: ADJUST_RIGHT,
                        default: ADJUST_LEFT,
                    });
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

    const onWheelProps = useOnWheelHandler(scrollHandler);

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
                // Deals with a bug on Android when `scrollTo`
                // doesn't work in scroll handlers.
                // It happens because by default `scrollTo`
                // doesn't stop `fling` effect,
                // so I had to extend horizontal scroll view
                // to be able to disable it
                {...Platform.select({
                    android: {
                        onMomentumScrollBegin: () => undefined,
                        flingEnabled: !pagingEnabled,
                    },
                })}
                {...onWheelProps}
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
            <View style={[styles.controlPanel, contentStyle]}>
                <Dots
                    currentProgress={currentProgress}
                    currentGravityPosition={currentGravityPosition}
                />
                <WebPositionControl
                    scrollRef={scrollRef}
                    currentGravityPosition={currentGravityPosition}
                    calculateClosestLeftX={calculateClosestLeftX}
                    calculateClosestRightX={calculateClosestRightX}
                />
            </View>
            {debug && (
                <DebugView
                    currentGravityPosition={currentGravityPosition}
                    contentInset={contentInset}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: 'relative' },
    controlPanel: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
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
