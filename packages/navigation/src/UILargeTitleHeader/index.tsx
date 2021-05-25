import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    UIBackgroundView,
} from '@tonlabs/uikit.hydrogen';

import { useOnScrollHandler } from './useOnScrollHandler';
import { getYWithRubberBandEffect } from './getYWithRubberBandEffect';
import { ScrollableContext } from '../Scrollable/Context';
import { useOnWheelHandler } from './useOnWheelHandler';
import { useResetPosition } from './useResetPosition';
import { HEADER_HEIGHT, SCREEN_CONTENT_INSET_HORIZONTAL } from '../constants';
import { UINavigationBar, UINavigationBarProps } from '../UINavigationBar';

const AnimatedUILabel = Animated.createAnimatedComponent(UILabel);

const RUBBER_BAND_EFFECT_DISTANCE = Platform.select({ web: 50, default: 150 });

type UILargeTitleHeaderProps = UINavigationBarProps & {
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

export function UILargeTitleHeader({
    label,
    note,
    children,
    ...navigationBarProps
}: UILargeTitleHeaderProps) {
    // TODO: rename
    const blockShift = useSharedValue(0);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const largeTitleViewRef = useAnimatedRef<Animated.View>();
    const largeTitleHeight = useSharedValue(0);

    // TODO: explain what it is
    const yWithoutRubberBand = useSharedValue(0);
    // TODO: explain what it is
    const yOverScroll = useSharedValue(true);

    const onScroll = useOnScrollHandler(
        scrollRef,
        largeTitleViewRef,
        largeTitleHeight,
        yOverScroll,
        yWithoutRubberBand,
        blockShift,
        RUBBER_BAND_EFFECT_DISTANCE,
    );

    const onEndDrag = useResetPosition(blockShift, largeTitleHeight);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll,
        onBeginDrag: () => {
            yWithoutRubberBand.value = blockShift.value;
        },
        onEndDrag,
    });

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: blockShift.value,
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
        };
    });

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
    }, [largeTitleHeight, blockShift]);

    const ghYPrev = useSharedValue(0);
    // TODO: explain why we need GH at all
    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event) => {
            const y = ghYPrev.value - event.translationY;
            ghYPrev.value = event.translationY;

            if (yOverScroll.value) {
                if (y > 0) {
                    return;
                }

                // TODO: copy pasted
                yWithoutRubberBand.value -= y;
                if (blockShift.value > 0) {
                    blockShift.value = getYWithRubberBandEffect(
                        yWithoutRubberBand.value,
                        RUBBER_BAND_EFFECT_DISTANCE,
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

    // TODO: explain how it works and about wheel events on macos
    const onWheel = useOnWheelHandler(
        blockShift,
        largeTitleHeight,
        yOverScroll,
        yWithoutRubberBand,
        RUBBER_BAND_EFFECT_DISTANCE,
    );

    const scrollableContextValue = React.useMemo(
        () => ({
            ref: scrollRef,
            scrollHandler,
            gestureHandler,
            onWheel,
        }),
        [scrollRef, scrollHandler, gestureHandler, onWheel],
    );

    const { top } = useSafeAreaInsets();

    return (
        <UIBackgroundView style={[styles.container, { paddingTop: top }]}>
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
                    {navigationBarProps.title && (
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
                            {navigationBarProps.title}
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
            <UIBackgroundView
                style={[
                    styles.mainHeaderContainer,
                    { height: HEADER_HEIGHT + top, paddingTop: top },
                ]}
            >
                <UINavigationBar
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
    mainHeaderFiller: { height: HEADER_HEIGHT },
    mainHeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    mainHeaderTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    largeTitleHeaderContainer: {
        padding: SCREEN_CONTENT_INSET_HORIZONTAL,
    },
    sceneContainer: {
        // TODO: explain this
        height: '100%',
    },
});
