import * as React from 'react';
import { View, StyleSheet, Platform, LayoutChangeEvent } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    useAnimatedRef,
    useDerivedValue,
    withTiming,
    Extrapolate,
    useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    UIBackgroundView,
} from '@tonlabs/uikit.hydrogen';

import { useOnScrollHandler } from './useOnScrollHandler';
import { useHasScroll } from '../Scrollable';
import { ScrollableContext } from '../Scrollable/Context';
import { useOnWheelHandler } from './useOnWheelHandler';
import { useResetPosition } from './useResetPosition';
import { UIConstant } from '../constants';
import type { UINavigationBarProps } from '../UINavigationBar';
import { UIStackNavigationBar } from '../UIStackNavigationBar';

const AnimatedUILabel = Animated.createAnimatedComponent(UILabel);

const RUBBER_BAND_EFFECT_DISTANCE = Platform.select({ web: 50, default: 150 });
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
const LARGE_HEADER_BOTTOM_OFFSET_TO_SHOW_TITLE = 20;

export const UILargeTitleContainerRefContext = React.createContext<React.RefObject<
    View
> | null>(null);

export type UILargeTitleHeaderProps = UINavigationBarProps & {
    /**
     * A title to use only for collapsible title
     */
    headerLargeTitle?: UINavigationBarProps['title'];
    /**
     * A callback that fires when user press on large title header content
     */
    onHeaderLargeTitlePress?: () => void;
    /**
     * A label string
     */
    label?: string;
    /**
     * A note string
     */
    note?: string;
    /**
     * Header has a context provider for children to use in scrollables
     */
    children: React.ReactNode;
};

export function UILargeTitleHeader({
    label,
    note,
    children,
    onHeaderLargeTitlePress,
    ...navigationBarProps
}: UILargeTitleHeaderProps) {
    const shift = useSharedValue(0);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();

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
            if (
                largeTitleHeight.value > 0 &&
                largeTitleHeight.value !== height
            ) {
                largeTitleHeight.value = height;
            }
        },
        [largeTitleHeight],
    );

    // when we use `rubber band` effect, we need to know
    // actual y, that's why we need to store it separately
    const yWithoutRubberBand = useSharedValue(0);
    // see `useAnimatedGestureHandler`
    const yIsNegative = useSharedValue(true);

    const onScroll = useOnScrollHandler(
        scrollRef,
        largeTitleViewRef,
        largeTitleHeight,
        yIsNegative,
        yWithoutRubberBand,
        shift,
        RUBBER_BAND_EFFECT_DISTANCE,
    );

    const onEndDrag = useResetPosition(shift, largeTitleHeight);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll,
        onBeginDrag: () => {
            yWithoutRubberBand.value = shift.value;
        },
        onEndDrag,
        onMomentumEnd: onEndDrag,
    });

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: shift.value,
                },
            ],
        };
    });

    const titleWidth = useSharedValue(0);

    const LARGE_TITLE_SCALE = Platform.select({ web: 1.1, default: 1.2 });
    const largeTitleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: Animated.interpolate(
                        shift.value,
                        [0, RUBBER_BAND_EFFECT_DISTANCE],
                        [1, LARGE_TITLE_SCALE],
                        {
                            extrapolateLeft: Extrapolate.CLAMP,
                        },
                    ),
                },
                {
                    translateX: Animated.interpolate(
                        shift.value,
                        [0, RUBBER_BAND_EFFECT_DISTANCE],
                        [
                            0,
                            (titleWidth.value * LARGE_TITLE_SCALE -
                                titleWidth.value) /
                                2,
                        ],
                        {
                            extrapolateLeft: Extrapolate.CLAMP,
                        },
                    ),
                },
            ],
        };
    });

    const headerTitleVisible = useSharedValue(false);
    const headerTitleOpacity = useSharedValue(0);

    useDerivedValue(() => {
        if (largeTitleHeight.value === 0) {
            return;
        }
        const yPointToShowTitle =
            0 -
            largeTitleHeight.value +
            LARGE_HEADER_BOTTOM_OFFSET_TO_SHOW_TITLE;
        if (!headerTitleVisible.value && shift.value < yPointToShowTitle) {
            headerTitleOpacity.value = withTiming(1, {
                duration: HEADER_TITLE_OPACITY_ANIM_DURATION,
            });
            headerTitleVisible.value = true;
            return;
        }
        if (headerTitleVisible.value && shift.value > yPointToShowTitle) {
            headerTitleOpacity.value = withTiming(0, {
                duration: HEADER_TITLE_OPACITY_ANIM_DURATION,
            });
            headerTitleVisible.value = false;
        }
    }, [largeTitleHeight, shift]);

    const ghYPrev = useSharedValue(0);

    const { hasScroll, hasScrollShared, setHasScroll } = useHasScroll();

    /**
     * On Android ScrollView stops to fire events when it reaches the end (y is 0).
     * For that reason we place a ScrollView inside of PanResponder,
     * and listen for that events too.
     *
     * In a regular case we just handle events from scroll.
     * But when we see that `y` point is 0 or less, we set a `yIsNegative` guard to true.
     * That tells GH handler to start handle events from a pan gesture.
     * And that is how we are able to animate large header on overscroll.
     */
    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event) => {
            const y = ghYPrev.value - event.translationY;
            ghYPrev.value = event.translationY;

            if (!hasScrollShared.value) {
                // @ts-ignore
                onScroll({ contentOffset: { y } });
                return;
            }

            if (yIsNegative.value && y < 0) {
                // @ts-ignore
                onScroll({ contentOffset: { y } });
            }
        },
        onStart: () => {
            if (!hasScrollShared.value) {
                yWithoutRubberBand.value = shift.value;
                return;
            }
            if (yIsNegative.value) {
                yWithoutRubberBand.value = shift.value;
            }
        },
        onEnd: () => {
            if (!hasScrollShared.value) {
                onEndDrag();
            }
            ghYPrev.value = 0;
        },
    });

    /**
     * On web listening to `scroll` events is not enough,
     * because when it reaches the end (y is 0)
     * it stops to fire new events.
     *
     * But to understand that user still scrolling at the moment
     * we can listen for `wheel` events.
     *
     * That's kinda the same what we did for Android with RNGH
     */
    const onWheel = useOnWheelHandler(
        shift,
        largeTitleHeight,
        yIsNegative,
        yWithoutRubberBand,
        hasScrollShared,
        onScroll,
    );

    const [scrollablesCount, setScrollablesCount] = React.useState(0);
    const scrollablesCountRef = React.useRef(0);

    const hasScrollables = React.useMemo(() => scrollablesCount > 0, [
        scrollablesCount,
    ]);

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

    const title =
        navigationBarProps.headerLargeTitle || navigationBarProps.title;

    const hasSomethingInHeader = title != null || label != null || note != null;

    const largeTitleInnerElement = (
        <>
            {label != null && (
                <UILabel
                    role={UILabelRoles.ParagraphLabel}
                    color={UILabelColors.TextSecondary}
                    style={{ marginBottom: 8 }}
                >
                    {label}
                </UILabel>
            )}
            {title != null &&
                (React.isValidElement(title) ? (
                    title
                ) : (
                    <AnimatedUILabel
                        role={UILabelRoles.TitleLarge}
                        style={largeTitleStyle}
                        onLayout={({
                            nativeEvent: {
                                layout: { width },
                            },
                        }) => {
                            titleWidth.value = width;
                        }}
                    >
                        {title}
                    </AnimatedUILabel>
                ))}
            {note != null && (
                <UILabel
                    role={UILabelRoles.ParagraphNote}
                    style={{ marginTop: 8 }}
                >
                    {note}
                </UILabel>
            )}
        </>
    );

    const contentContainerRef = React.useRef<View>(null);

    return (
        <UIBackgroundView
            style={styles.container}
            ref={contentContainerRef}
            collapsable={false}
        >
            <View style={styles.mainHeaderFiller} />
            <Animated.View style={[{ flex: 1 }, style]}>
                <Animated.View
                    ref={largeTitleViewRef}
                    style={
                        hasSomethingInHeader && styles.largeTitleHeaderContainer
                    }
                    onLayout={onLargeTitleLayout}
                >
                    {onHeaderLargeTitlePress != null ? (
                        <TouchableOpacity onPress={onHeaderLargeTitlePress}>
                            {largeTitleInnerElement}
                        </TouchableOpacity>
                    ) : (
                        largeTitleInnerElement
                    )}
                </Animated.View>

                {/* TODO(savelichalex): This is a huge hack for UIController measurement mechanics
                need to get rid of it as soon as we'll manage to remove UIController  */}
                <UILargeTitleContainerRefContext.Provider
                    value={contentContainerRef}
                >
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
                <UIStackNavigationBar
                    {...navigationBarProps}
                    headerTitleOpacity={headerTitleOpacity}
                />
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
    mainHeaderFiller: { height: UIConstant.headerHeight },
    mainHeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: UIConstant.headerHeight,
    },
    mainHeaderTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    largeTitleHeaderContainer: {
        padding: UIConstant.scrollContentInsetHorizontal,
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
