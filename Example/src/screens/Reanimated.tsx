import * as React from 'react';
import {
    View,
    StyleSheet,
    ScrollView as RNScrollView,
    ScrollViewProps as RNScrollViewProps,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ScrollViewProps,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedScrollHandler,
    scrollTo as scrollToNative,
    measure as measureNative,
    useAnimatedStyle,
    useSharedValue,
    useAnimatedRef,
    withSpring,
    useDerivedValue,
    withTiming,
    Extrapolate,
    useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';
import {
    NativeViewGestureHandler,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const AnimatedScrollView = Animated.createAnimatedComponent<RNScrollViewProps>(
    RNScrollView,
);
const AnimatedUILabel = Animated.createAnimatedComponent(UILabel);

const RUBBER_BAND_EFFECT_DISTANCE = Platform.select({ web: 50, default: 150 });

function getYWithRubberBandEffect(y: number) {
    'worklet';

    // Rubber band effect
    // https://medium.com/@esskeetit/как-работает-uiscrollview-2e7052032d97
    //

    return (
        (1 - 1 / (Math.abs(y) / RUBBER_BAND_EFFECT_DISTANCE + 1)) *
        RUBBER_BAND_EFFECT_DISTANCE
    );
}

const ScrollableContext = React.createContext<{
    ref: React.Ref<RNScrollView>;
    scrollHandler:
        | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
        | null;
    gestureHandler: ((event: PanGestureHandlerGestureEvent) => void) | null;
    onWheel: (() => void) | null;
}>({
    ref: null,
    scrollHandler: null,
    gestureHandler: null,
    onWheel: null,
});

type LargeTitleHeaderProps = {
    /**
     * A title string
     */
    title?: string;
    /**
     * A caption string
     */
    caption?: string;
    /**
     * A label string
     */
    label?: string;
    /**
     * A note string
     */
    note?: string;
    /**
     * Header has a context provider to children to use in scrollables
     */
    children: React.ReactNode;
};

const measure: (
    ...args: Parameters<typeof measureNative>
) => Promise<ReturnType<typeof measureNative>> = (...args) => {
    'worklet';

    if (Platform.OS === 'web') {
        return new Promise((resolve, reject) => {
            const [aref] = args;
            if (aref && aref.current) {
                aref.current.measure((x, y, width, height, pageX, pageY) => {
                    resolve({ x, y, width, height, pageX, pageY });
                });
            } else {
                reject(new Error('measure: animated ref not ready'));
            }
        });
    }

    return Promise.resolve(measureNative(...args));
};

const scrollTo: (
    ...args: Parameters<typeof scrollToNative>
) => Promise<void> = (...args) => {
    'worklet';

    if (Platform.OS === 'web') {
        return new Promise((resolve, reject) => {
            const [aref, x, y] = args;
            if (aref && aref.current) {
                aref.current.scrollTo({ x, y });
                resolve(undefined);
            } else {
                reject(new Error('measure: animated ref not ready'));
            }
        });
    }

    scrollToNative(...args);
    return Promise.resolve(undefined);
};

function LargeTitleHeader({
    title,
    caption,
    label,
    note,
    children,
}: LargeTitleHeaderProps) {
    const blockShift = useSharedValue(0);
    const scrollRef = useAnimatedRef<RNScrollView>();

    const largeTitleViewRef = useAnimatedRef<Animated.View>();
    const largeTitleHeight = useSharedValue(0);

    const yWithoutRubberBand = useSharedValue(0);

    const yOverScroll = useSharedValue(true);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const { y } = event.contentOffset;

            if (largeTitleHeight.value === 0) {
                try {
                    // largeTitleHeight.value =
                    //     (await measure(largeTitleViewRef)).height || 0;
                    largeTitleHeight.value =
                        measureNative(largeTitleViewRef).height || 0;
                } catch (e) {
                    // nothing
                }
            }
            yOverScroll.value = y <= 0;
            if (y <= 0) {
                // scrollTo reset real y, so we need to count it ourselves
                yWithoutRubberBand.value -= y;
                if (blockShift.value > 0) {
                    blockShift.value = getYWithRubberBandEffect(
                        yWithoutRubberBand.value,
                    );
                } else {
                    blockShift.value -= y;
                }
                // await scrollTo(scrollRef, 0, 0, false);
                scrollToNative(scrollRef, 0, 0, false);
            } else if (blockShift.value > 0 - largeTitleHeight.value) {
                // scrollTo reset real y, so we need to count it ourselves
                yWithoutRubberBand.value -= y;
                blockShift.value = Math.max(
                    blockShift.value - y,
                    0 - largeTitleHeight.value,
                );
                // await scrollTo(scrollRef, 0, 0, false);
                scrollToNative(scrollRef, 0, 0, false);
            }
        },
        onBeginDrag: () => {
            yWithoutRubberBand.value = blockShift.value;
        },
        onEndDrag: () => {
            if (blockShift.value > (0 - largeTitleHeight.value) / 2) {
                blockShift.value = withSpring(0, {
                    overshootClamping: true,
                });
            } else {
                blockShift.value = withSpring(0 - largeTitleHeight.value, {
                    overshootClamping: true,
                });
            }
        },
    });

    const style = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: blockShift.value,
            },
        ],
    }));

    const titleWidth = useSharedValue(0);

    const LARGE_TITLE_SCALE = Platform.select({ web: 1.1, default: 1.2 });
    const largeTitleStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: Animated.interpolate(
                    blockShift.value,
                    [0, RUBBER_BAND_EFFECT_DISTANCE],
                    [1, LARGE_TITLE_SCALE],
                    {
                        extrapolateLeft: Extrapolate.CLAMP,
                    },
                ),
            },
            {
                translateX: Animated.interpolate(
                    blockShift.value,
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
    }));

    const headerTitleVisible = useSharedValue(false);
    const headerTitleOpacity = useSharedValue(0);

    useDerivedValue(() => {
        if (largeTitleHeight.value === 0) {
            return;
        }
        if (
            !headerTitleVisible.value &&
            blockShift.value < 0 - largeTitleHeight.value + 20
        ) {
            headerTitleOpacity.value = withTiming(1, {
                duration: 100,
            });
            headerTitleVisible.value = true;
            return;
        }
        if (
            headerTitleVisible.value &&
            blockShift.value > 0 - largeTitleHeight.value + 20
        ) {
            headerTitleOpacity.value = withTiming(0, {
                duration: 100,
            });
            headerTitleVisible.value = false;
        }
    });

    const headerTitleStyle = useAnimatedStyle(() => ({
        opacity: headerTitleOpacity.value,
    }));

    const ghYPrev = useSharedValue(0);
    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event) => {
            const y = ghYPrev.value - event.translationY;
            ghYPrev.value = event.translationY;

            if (yOverScroll.value) {
                if (y > 0) {
                    return;
                }

                yWithoutRubberBand.value -= y;
                if (blockShift.value > 0) {
                    blockShift.value = getYWithRubberBandEffect(
                        yWithoutRubberBand.value,
                    );
                } else {
                    blockShift.value -= y;
                }
            }
        },
        onStart: () => {
            if (yOverScroll.value) {
                yWithoutRubberBand.value = blockShift.value;
            }
        },
        onEnd: () => {
            ghYPrev.value = 0;
        },
    });

    let onWheelEndTimeout: NodeJS.Timeout | null = null;
    const onWheelEndCbRef = React.useRef(() => {
        if (blockShift.value > (0 - largeTitleHeight.value) / 2) {
            blockShift.value = withSpring(0, {
                overshootClamping: true,
            });
        } else {
            blockShift.value = withSpring(0 - largeTitleHeight.value, {
                overshootClamping: true,
            });
        }
        onWheelEndTimeout = null;
    });
    const onWheel = React.useCallback(
        (event) => {
            const { deltaY } = event.nativeEvent;

            if (onWheelEndTimeout != null) {
                clearTimeout(onWheelEndTimeout);
            } else if (yOverScroll.value) {
                yWithoutRubberBand.value = blockShift.value;
            }

            onWheelEndTimeout = setTimeout(onWheelEndCbRef.current, 100);

            if (yOverScroll.value && deltaY < 0) {
                yWithoutRubberBand.value -= deltaY;
                if (blockShift.value > 0) {
                    blockShift.value = getYWithRubberBandEffect(
                        yWithoutRubberBand.value,
                    );
                } else {
                    blockShift.value -= deltaY;
                }
            }
        },
        [yOverScroll, blockShift, yWithoutRubberBand],
    );

    const scrollableContextValue = React.useMemo(
        () => ({
            ref: scrollRef,
            scrollHandler,
            gestureHandler,
            onWheel: Platform.OS === 'web' && onWheel,
        }),
        [scrollRef, scrollHandler, gestureHandler, onWheel],
    );

    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <View style={styles.mainHeaderFiller} />
            <Animated.View style={[{ flex: 1 }, style]}>
                <Animated.View
                    ref={largeTitleViewRef}
                    style={[styles.largeTitleHeaderContainer]}
                >
                    {label && (
                        <UILabel
                            role={UILabelRoles.ParagraphLabel}
                            color={UILabelColors.TextSecondary}
                        >
                            {label}
                        </UILabel>
                    )}
                    {title && (
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
                    )}
                    {note && (
                        <UILabel role={UILabelRoles.ParagraphNote}>
                            {note}
                        </UILabel>
                    )}
                </Animated.View>

                <ScrollableContext.Provider value={scrollableContextValue}>
                    <Animated.View style={styles.sceneContainer}>
                        {children}
                    </Animated.View>
                </ScrollableContext.Provider>
            </Animated.View>
            <View
                style={[
                    styles.mainHeaderContainer,
                    { height: 56 + top, paddingTop: top },
                ]}
            >
                <Animated.View
                    style={[styles.mainHeaderTitleContainer, headerTitleStyle]}
                >
                    {title && (
                        <UILabel role={UILabelRoles.HeadlineHead}>
                            {title}
                        </UILabel>
                    )}
                    {caption && (
                        <UILabel
                            role={UILabelRoles.ParagraphFootnote}
                            color={UILabelColors.TextSecondary}
                        >
                            {caption}
                        </UILabel>
                    )}
                </Animated.View>
            </View>
        </View>
    );
}

function ScrollView(props: ScrollViewProps & { children: React.ReactNode }) {
    const panGestureRef = React.useRef<PanGestureHandler>(null);
    const nativeGestureRef = React.useRef<NativeViewGestureHandler>(null);
    return (
        <ScrollableContext.Consumer>
            {({ ref, scrollHandler, gestureHandler, onWheel }) => (
                <PanGestureHandler
                    ref={panGestureRef}
                    enabled={Platform.OS !== 'web'}
                    shouldCancelWhenOutside={false}
                    // simultaneousHandlers={nativeGestureRef}
                    onGestureEvent={gestureHandler}
                    waitFor={nativeGestureRef}
                >
                    <Animated.View style={{ flex: 1 }}>
                        <NativeViewGestureHandler
                            ref={nativeGestureRef}
                            // simultaneousHandlers={panGestureRef}
                        >
                            <Animated.View style={styles.sceneContainer}>
                                <Animated.ScrollView
                                    {...props}
                                    ref={ref}
                                    overScrollMode="never"
                                    onScrollBeginDrag={scrollHandler}
                                    scrollEventThrottle={16}
                                    onWheel={onWheel}
                                />
                            </Animated.View>
                        </NativeViewGestureHandler>
                    </Animated.View>
                </PanGestureHandler>
            )}
        </ScrollableContext.Consumer>
    );
}

export function ReanimatedScreen() {
    return (
        <LargeTitleHeader title="Long title">
            <ScrollView>
                {new Array(9)
                    .fill(null)
                    .map((_el, i) => (i + 1) / 10)
                    // .reverse()
                    .map((opacity) => (
                        <View
                            key={opacity}
                            style={{
                                height: 100,
                                backgroundColor: `rgba(255,0,0,${opacity})`,
                            }}
                        />
                    ))}
            </ScrollView>
        </LargeTitleHeader>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'white', // TODO: do we need to set a color? TODO: theme support
    },
    mainHeaderFiller: { height: 56 },
    mainHeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white', // TODO: do we need to set a color? TODO: theme support
    },
    mainHeaderTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    largeTitleHeaderContainer: {
        padding: 16,
        backgroundColor: 'white', // TODO: do we need to set a color? TODO: theme support
    },
    sceneContainer: {
        height: '100%',
    },
});
