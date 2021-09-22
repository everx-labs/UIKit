import * as React from 'react';
import { View, StyleSheet, Platform, LayoutChangeEvent } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedRef,
    withTiming,
    Extrapolate,
    interpolate,
    useAnimatedReaction,
    scrollTo,
} from 'react-native-reanimated';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIBackgroundView, UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import { useHasScroll } from '../Scrollable';
import { ScrollableContext } from '../Scrollable/Context';
import { UIConstant } from '../constants';
import type { UINavigationBarProps } from '../UINavigationBar';
import { UIStackNavigationBar } from '../UIStackNavigationBar';
import { useScrollHandler } from './useScrollHandler';

const AnimatedUILabel = Animated.createAnimatedComponent(UILabel);

const RUBBER_BAND_EFFECT_DISTANCE = Platform.select({ web: 50, default: 100 });
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

export const UILargeTitleContainerRefContext = React.createContext<React.RefObject<View> | null>(
    null,
);

const UILargeTitlePositionContext = React.createContext<{
    position?: Animated.SharedValue<number>;
    forceChangePosition?: (
        position: number,
        options: { duration?: number; changeDefaultShift?: boolean },
        callback?: ((isFinished: boolean) => void) | undefined,
    ) => void;
}>({});

export function useLargeTitlePosition() {
    return React.useContext(UILargeTitlePositionContext);
}

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
     * A callback that fires when the user presses on large title header content longer than 500 milliseconds
     */
    onHeaderLargeTitleLongPress?: () => void;
    /**
     * A label string
     */
    label?: string;
    /**
     * A note string
     */
    note?: string;
    /**
     * What content to render above large title, if any
     */
    renderAboveContent?: () => React.ReactNode;
    /**
     * What content to render below large title, if any
     */
    renderBelowContent?: () => React.ReactNode;
    /**
     * Header has a context provider for children to use in scrollables
     */
    children: React.ReactNode;
};

export function UILargeTitleHeader({
    label,
    note,
    children,
    renderAboveContent,
    renderBelowContent,
    onHeaderLargeTitlePress,
    onHeaderLargeTitleLongPress,
    ...navigationBarProps
}: UILargeTitleHeaderProps) {
    const shift = useSharedValue(0);
    const defaultShift = useSharedValue(0);

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
        shift,
        defaultShift,
        largeTitleHeight,
        hasScrollShared,
        RUBBER_BAND_EFFECT_DISTANCE,
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

    const titleWidth = useSharedValue(0);

    const LARGE_TITLE_SCALE = Platform.select({ web: 1.1, default: 1.2 });
    const largeTitleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(
                        shift.value,
                        [0, RUBBER_BAND_EFFECT_DISTANCE],
                        [1, LARGE_TITLE_SCALE],
                        {
                            extrapolateLeft: Extrapolate.CLAMP,
                        },
                    ),
                },
                {
                    translateX: interpolate(
                        shift.value,
                        [0, RUBBER_BAND_EFFECT_DISTANCE],
                        [0, (titleWidth.value * LARGE_TITLE_SCALE - titleWidth.value) / 2],
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

    const title = navigationBarProps.headerLargeTitle || navigationBarProps.title;
    const hasSomethingInHeader = title != null || label != null || note != null;
    const onTitleLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { width },
            },
        }) => {
            titleWidth.value = width;
        },
        [titleWidth],
    );

    const largeTitleInnerElement = (
        <>
            {label != null && (
                <UILabel
                    role={UILabelRoles.ParagraphLabel}
                    color={UILabelColors.TextSecondary}
                    style={styles.label}
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
                        onLayout={onTitleLayout}
                    >
                        {title}
                    </AnimatedUILabel>
                ))}
            {note != null && (
                <UILabel role={UILabelRoles.ParagraphNote} style={styles.note}>
                    {note}
                </UILabel>
            )}
        </>
    );

    const contentContainerRef = React.useRef<View>(null);

    const forceChangePosition = React.useCallback(
        (
            position: number,
            options: { duration?: number; changeDefaultShift?: boolean } = {},
            callback?: ((isFinished: boolean) => void) | undefined,
        ) => {
            // Do not interupt active scroll
            if (!scrollInProgress.value) {
                shift.value = withTiming(position, { duration: options.duration ?? 0 }, callback);
                scrollTo(scrollRef, 0, 0, false);
            }
            if (options.changeDefaultShift) {
                defaultShift.value = position;
            }
        },
        [shift, defaultShift, scrollInProgress, scrollRef],
    );

    const positionContext = React.useMemo(
        () => ({
            position: shift,
            forceChangePosition,
        }),
        [shift, forceChangePosition],
    );

    return (
        <UIBackgroundView style={styles.container} ref={contentContainerRef} collapsable={false}>
            <View style={styles.mainHeaderFiller} />
            <Animated.View style={[styles.inner, style]}>
                <Animated.View ref={largeTitleViewRef} onLayout={onLargeTitleLayout}>
                    <UILargeTitlePositionContext.Provider value={positionContext}>
                        {renderAboveContent && renderAboveContent()}
                    </UILargeTitlePositionContext.Provider>
                    <View style={hasSomethingInHeader && styles.largeTitleHeaderInner}>
                        {onHeaderLargeTitlePress != null || onHeaderLargeTitleLongPress != null ? (
                            <TouchableOpacity
                                onPress={onHeaderLargeTitlePress}
                                onLongPress={onHeaderLargeTitleLongPress}
                            >
                                {largeTitleInnerElement}
                            </TouchableOpacity>
                        ) : (
                            largeTitleInnerElement
                        )}
                    </View>
                    <UILargeTitlePositionContext.Provider value={positionContext}>
                        {renderBelowContent && renderBelowContent()}
                    </UILargeTitlePositionContext.Provider>
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
    inner: {
        flex: 1,
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
    largeTitleHeaderInner: {
        padding: UIConstant.scrollContentInsetHorizontal,
    },
    label: {
        marginBottom: 8,
    },
    note: {
        marginTop: 8,
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
