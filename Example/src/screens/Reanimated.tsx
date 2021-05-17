import * as React from 'react';
import {
    View,
    StyleSheet,
    ScrollView as RNScrollView,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ScrollViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedScrollHandler,
    scrollTo,
    measure,
    useAnimatedStyle,
    useSharedValue,
    useAnimatedRef,
    withSpring,
    useDerivedValue,
    withTiming,
    Extrapolate,
} from 'react-native-reanimated';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

const AnimatedUILabel = Animated.createAnimatedComponent(UILabel);

const RUBBER_BAND_EFFECT_DISTANCE = 150;

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
}>({
    ref: null,
    scrollHandler: null,
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

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const { y } = event.contentOffset;

            if (largeTitleHeight.value === 0) {
                try {
                    largeTitleHeight.value =
                        measure(largeTitleViewRef).height || 0;
                } catch (e) {
                    // nothing
                }
            }
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
                scrollTo(scrollRef, 0, 0, false);
            } else if (blockShift.value > 0 - largeTitleHeight.value) {
                // scrollTo reset real y, so we need to count it ourselves
                yWithoutRubberBand.value -= y;
                blockShift.value = Math.max(
                    blockShift.value - y,
                    0 - largeTitleHeight.value,
                );
                scrollTo(scrollRef, 0, 0, false);
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

    const LARGE_TITLE_SCALE = 1.2;
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

    const scrollableContextValue = React.useMemo(
        () => ({
            ref: scrollRef,
            scrollHandler,
        }),
        [scrollRef, scrollHandler],
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
    return (
        <ScrollableContext.Consumer>
            {({ ref, scrollHandler }) => (
                <Animated.ScrollView
                    {...props}
                    ref={ref}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                />
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
