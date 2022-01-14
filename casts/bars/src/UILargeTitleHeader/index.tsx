import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedRef,
    withTiming,
    useAnimatedReaction,
} from 'react-native-reanimated';
import { UIBackgroundView } from '@tonlabs/uikit.themes';

import { useHasScroll, ScrollableContext } from '@tonlabs/uikit.scrolls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { UIStackNavigationBar } from '../UIStackNavigationBar';
import { useScrollHandler } from './useScrollHandler';
import { OnRefresh, RefreshControl } from './RefreshControl';
import type { UILargeTitleHeaderProps } from './types';
import { LargeTitleHeaderContent } from './LargeTitleHeaderContent';
import { NON_UI_RUBBER_BAND_EFFECT_DISTANCE } from './useRubberBandEffectDistance';

// @inline
const HEADER_TITLE_OPACITY_ANIM_DURATION = 100;
/**
 * This was introduced to match a behaviour of large title on iOS
 * on iOS the title is shown not when large title completely folded,
 * but rather when it reaches the end of large title text
 *
 * I didn't want to calculate an exact text position in runtime with `measure`,
 * as it make things more complicated, so I intruduced this offset,
 * that seems to work fine and close enough to original
 */
// @inline
const LARGE_HEADER_BOTTOM_OFFSET_TO_SHOW_TITLE = 20;

export const UILargeTitleContainerRefContext = React.createContext<React.RefObject<View> | null>(
    null,
);

const UILargeTitlePositionContext = React.createContext<{
    position?: Animated.SharedValue<number>;
    forceChangePosition?: (
        position: number,
        options: { duration?: number; changeDefaultShift?: boolean },
        callback?: ((isFinished?: boolean) => void) | undefined,
    ) => void;
}>({});

export function useLargeTitlePosition() {
    return React.useContext(UILargeTitlePositionContext);
}

function getDefaultShift(onRefresh?: OnRefresh) {
    return onRefresh != null ? -NON_UI_RUBBER_BAND_EFFECT_DISTANCE : 0;
}

function usePullToRefresh(
    scrollRef: React.RefObject<Animated.ScrollView>,
    shift: Animated.SharedValue<number>,
    scrollInProgress: Animated.SharedValue<boolean>,
    onRefresh?: OnRefresh,
) {
    return React.useMemo(() => {
        if (onRefresh == null) {
            return null;
        }

        return (
            <RefreshControl
                onRefresh={onRefresh}
                scrollRef={scrollRef}
                currentPosition={shift}
                scrollInProgress={scrollInProgress}
            />
        );
    }, [onRefresh, scrollRef, shift, scrollInProgress]);
}

function useLargeTitleHeaderOpacity(
    shift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
) {
    const headerTitleVisible = useSharedValue(false);
    const headerTitleOpacity = useSharedValue(0);

    useAnimatedReaction(
        () => {
            return {
                largeTitleHeight: largeTitleHeight.value,
                shift: shift.value,
            };
        },
        state => {
            if (state.largeTitleHeight === 0) {
                return;
            }
            const yPointToShowTitle =
                0 - state.largeTitleHeight + LARGE_HEADER_BOTTOM_OFFSET_TO_SHOW_TITLE;
            if (!headerTitleVisible.value && state.shift < yPointToShowTitle) {
                headerTitleOpacity.value = withTiming(1, {
                    duration: HEADER_TITLE_OPACITY_ANIM_DURATION,
                });
                headerTitleVisible.value = true;
                return;
            }
            if (headerTitleVisible.value && state.shift > yPointToShowTitle) {
                headerTitleOpacity.value = withTiming(0, {
                    duration: HEADER_TITLE_OPACITY_ANIM_DURATION,
                });
                headerTitleVisible.value = false;
            }
        },
        [largeTitleHeight, shift],
    );

    return headerTitleOpacity;
}

export function UILargeTitleHeader({
    headerNavigationBar,
    label,
    labelTestID,
    note,
    noteTestID,
    children,
    renderAboveContent,
    renderBelowContent,
    onHeaderLargeTitlePress,
    onHeaderLargeTitleLongPress,
    onRefresh,
    ...navigationBarProps
}: UILargeTitleHeaderProps) {
    const defaultShift = React.useMemo(() => getDefaultShift(onRefresh), [onRefresh]);
    const shift = useSharedValue(defaultShift);

    const localScrollRef = useAnimatedRef<Animated.ScrollView>();

    const largeTitleViewRef = useAnimatedRef<Animated.View>();
    const largeTitleHeight = useSharedValue(0);

    const onLargeTitleLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height },
            },
        }: LayoutChangeEvent) => {
            /**
             * Sometimes it's needed to invalidate a height of large title
             */
            if (largeTitleHeight.value > 0 && largeTitleHeight.value !== height) {
                largeTitleHeight.value = height;
            }
        },
        [largeTitleHeight],
    );

    const { ref: parentRef } = React.useContext(ScrollableContext);

    const scrollRef = parentRef || localScrollRef;

    const { hasScroll, hasScrollShared, setHasScroll } = useHasScroll();

    const { scrollInProgress, scrollHandler, gestureHandler, onWheel } = useScrollHandler(
        scrollRef,
        largeTitleViewRef,
        defaultShift,
        shift,
        largeTitleHeight,
        hasScrollShared,
    );

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY:
                        largeTitleHeight.value > 0
                            ? Math.max(shift.value, -largeTitleHeight.value)
                            : shift.value,
                },
            ],
        };
    });

    const [scrollablesCount, setScrollablesCount] = React.useState(0);
    const scrollablesCountRef = React.useRef(0);

    const hasScrollables = React.useMemo(() => scrollablesCount > 0, [scrollablesCount]);

    const registerScrollable = React.useCallback(() => {
        const count = scrollablesCountRef.current + 1;
        setScrollablesCount(count);
        scrollablesCountRef.current = count;
    }, [setScrollablesCount]);

    const unregisterScrollable = React.useCallback(() => {
        const count = scrollablesCountRef.current + 1;
        setScrollablesCount(count);
        scrollablesCountRef.current = count;
    }, [setScrollablesCount]);

    const { panGestureHandlerRef } = React.useContext(ScrollableContext);

    const scrollableContextValue = React.useMemo(
        () => ({
            ref: scrollRef,
            panGestureHandlerRef,
            scrollHandler,
            gestureHandler,
            onWheel,
            hasScroll,
            setHasScroll,
            registerScrollable,
            unregisterScrollable,
        }),
        [
            scrollRef,
            panGestureHandlerRef,
            scrollHandler,
            gestureHandler,
            onWheel,
            hasScroll,
            setHasScroll,
            registerScrollable,
            unregisterScrollable,
        ],
    );

    const contentContainerRef = React.useRef<View>(null);

    const headerTitleOpacity = useLargeTitleHeaderOpacity(shift, largeTitleHeight);

    const refreshControl = usePullToRefresh(scrollRef, shift, scrollInProgress, onRefresh);

    return (
        <UIBackgroundView style={styles.container} ref={contentContainerRef} collapsable={false}>
            <View style={styles.mainHeaderFiller} />
            <Animated.View style={[styles.inner, style]}>
                <Animated.View ref={largeTitleViewRef} onLayout={onLargeTitleLayout}>
                    {refreshControl}
                    {renderAboveContent && renderAboveContent()}
                    <LargeTitleHeaderContent
                        label={label}
                        labelTestID={labelTestID}
                        title={navigationBarProps.headerLargeTitle || navigationBarProps.title}
                        titleTestID={
                            navigationBarProps.headerLargeTitleTestID ||
                            navigationBarProps.titleTestID
                        }
                        note={note}
                        noteTestID={noteTestID}
                        onHeaderLargeTitlePress={onHeaderLargeTitlePress}
                        onHeaderLargeTitleLongPress={onHeaderLargeTitleLongPress}
                        shift={shift}
                    />
                    {renderBelowContent && renderBelowContent()}
                </Animated.View>

                {/* TODO(savelichalex): This is a huge hack for UIController measurement mechanics
                need to get rid of it as soon as we'll manage to remove UIController  */}
                <UILargeTitleContainerRefContext.Provider value={contentContainerRef}>
                    <ScrollableContext.Provider value={scrollableContextValue}>
                        <Animated.View
                            style={
                                hasScroll || hasScrollables
                                    ? styles.sceneContainerWithScroll
                                    : styles.sceneContainerWithoutScroll
                            }
                        >
                            {children}
                        </Animated.View>
                    </ScrollableContext.Provider>
                </UILargeTitleContainerRefContext.Provider>
            </Animated.View>
            <UIBackgroundView style={styles.mainHeaderContainer}>
                {headerNavigationBar?.() ?? (
                    <UIStackNavigationBar
                        {...navigationBarProps}
                        headerTitleOpacity={headerTitleOpacity}
                    />
                )}
            </UIBackgroundView>
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    inner: {
        flex: 1,
    },
    mainHeaderFiller: { height: UILayoutConstant.headerHeight },
    mainHeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: UILayoutConstant.headerHeight,
    },
    mainHeaderTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    sceneContainerWithoutScroll: {
        flex: 1,
    },
    sceneContainerWithScroll: {
        /**
         * We render both large title container and a content in one wrapper. So, now let's try imagine how it's drawed:
         *
         * - large title wrapper has intrinsic size
         * - content has the rest
         *
         * Let's assume it has proportions like 20/80 in percents of the height.
         * The problem is, that large header wrapper will be scrolled under a header.
         * That means that after wrapper was scrolled under we will see
         * only 100 - 20 = 80% of the content, that was rendered.
         * But we need to fill all our screen.
         * That's exactly why we use 100% height for our content,
         * and now we have 20/100 proportion, that 20% is what we have "under" the screen,
         * that's gonna be visible when large title will be scrolled under.
         */
        height: '100%',
    },
});
