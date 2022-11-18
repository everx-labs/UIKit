import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    Platform,
    LayoutChangeEvent,
    I18nManager,
} from 'react-native';
import Animated, {
    runOnJS,
    scrollTo,
    SharedValue,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

import { Dots } from './Dots';
import { usePositions } from './usePositions';
import { useOnWheelHandler } from './useOnWheelHandler';
import { WebPositionControl } from './WebPositionControls';
import { runOnUIPlatformSelect } from './runOnUIPlatformSelect';
import { HighlightsNativeGestureRefProvider } from './HighlightsNativeGestureRefContext';
import { useCards } from './useCards';
import type { UIHighlightsContentInset, UIHighlightsProps } from './types';

// @inline
const ADJUST_NONE = 0;
// @inline
const ADJUST_LEFT = 1;
// @inline
const ADJUST_RIGHT = 2;

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
    controlsHidden = false,
}: UIHighlightsProps) {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const scrollViewWidthRef = React.useRef<number>(0);
    const scrollViewContentWidthShared = useSharedValue(0);

    const currentGravityPosition = useSharedValue(0);
    const currentProgress = useSharedValue(0);

    const isRrlShared = useSharedValue(I18nManager.getConstants().isRTL);

    const {
        onItemLayout,
        calculateCurrentPosition,
        calculateClosestX,
        calculateClosestPreviousX,
        calculateClosestNextX,
        sharedContext,
    } = usePositions(React.Children.count(children), scrollViewContentWidthShared, isRrlShared);

    const onScrollViewLayout = React.useCallback((event: LayoutChangeEvent) => {
        const {
            nativeEvent: {
                layout: { width },
            },
        } = event;
        scrollViewWidthRef.current = width;
    }, []);

    const onScrollViewSizeChange = React.useCallback(
        (w: number) => {
            scrollViewContentWidthShared.value = w;
        },
        [scrollViewContentWidthShared],
    );

    type ScrollContext = { adjustOnMomentum: number };
    const scrollHandler = useAnimatedScrollHandler<ScrollContext>({
        onScroll(event) {
            const {
                contentOffset: { x: rawX },
            } = event;

            if (rawX == null || isNaN(rawX)) {
                return;
            }

            /**
             * We invert x-coordinate for RTL mode to simplify calculations
             */
            const x = isRrlShared.value ? -rawX : rawX;

            // Check if we've reached the end
            if (x >= scrollViewContentWidthShared.value - scrollViewWidthRef.current) {
                // Set the current gravity position as for the last item
                currentGravityPosition.value = sharedContext.value.positions.length - 1;
                currentProgress.value = 0;
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
                closestX = calculateClosestPreviousX(currentGravityPosition.value);
            } else if (ctx.adjustOnMomentum === ADJUST_RIGHT) {
                closestX = calculateClosestNextX(currentGravityPosition.value);
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

    const nativeGestureRef = React.useRef<NativeViewGestureHandler>(null);

    const cards = useCards(children, contentInset, spaceBetween, onItemLayout);

    if (!React.Children.count(children)) {
        // return null if the list of cards is empty;
        // otherwise, controls will be visible
        return null;
    }

    return (
        <View style={styles.container}>
            <NativeViewGestureHandler
                {...Platform.select({
                    // Note: We should provide a native gesture ref to `waitFor` it in
                    // `Pressable` used in UIHighlightCard in order to allow scrolling
                    // when pressing (tapping / long-pressing) the card.
                    // Unfortunately when applying such behaviour on Android the "press" gestures
                    // stop responding and do not call the corresponding events.
                    // Looks like a bug in RNGH.
                    ios: {
                        ref: nativeGestureRef,
                    },
                })}
                disallowInterruption
                shouldCancelWhenOutside={false}
            >
                <Animated.ScrollView
                    ref={scrollRef}
                    horizontal
                    onScrollBeginDrag={scrollHandler}
                    scrollEventThrottle={16}
                    contentContainerStyle={contentStyle}
                    disableIntervalMomentum
                    showsHorizontalScrollIndicator={false}
                    {...Platform.select({
                        android: {
                            // By default ScrollView in RN on Android doesn't sent momentum events
                            // see https://github.com/facebook/react-native/blob/ef6ab3f5cad968d7b2c9127d834429b0f4e1b2cf/Libraries/Components/ScrollView/ScrollView.js#L1741-L1744
                            onMomentumScrollBegin: () => undefined,
                            // Deals with a bug on Android when `scrollTo`
                            // doesn't work in scroll handlers.
                            // It happens because by default `scrollTo`
                            // doesn't stop `fling` effect,
                            // so I had to extend horizontal scroll view
                            // to be able to disable it
                            //
                            // This is done by us, see `UIKitHorizontalScrollViewManager.java`
                            flingEnabled: !pagingEnabled,
                        },
                    })}
                    {...onWheelProps}
                    onLayout={onScrollViewLayout}
                    onContentSizeChange={onScrollViewSizeChange}
                >
                    <HighlightsNativeGestureRefProvider gestureRef={nativeGestureRef}>
                        {cards}
                    </HighlightsNativeGestureRefProvider>
                </Animated.ScrollView>
            </NativeViewGestureHandler>
            {controlsHidden ? null : (
                <View style={[styles.controlPanel, contentStyle]}>
                    <Dots
                        currentProgress={currentProgress}
                        currentGravityPosition={currentGravityPosition}
                    />
                    <WebPositionControl
                        scrollRef={scrollRef}
                        currentGravityPosition={currentGravityPosition}
                        calculateClosestPreviousX={calculateClosestPreviousX}
                        calculateClosestNextX={calculateClosestNextX}
                    />
                </View>
            )}
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
