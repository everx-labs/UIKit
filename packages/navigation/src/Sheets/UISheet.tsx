import * as React from 'react';
import {
    View,
    StyleSheet,
    ViewStyle,
    StyleProp,
    Platform,
    Keyboard,
} from 'react-native';
// @ts-expect-error
import SpringConfig from 'react-native/Libraries/Animated/src/SpringConfig';
import {
    PanGestureHandler,
    TapGestureHandler,
    PanGestureHandlerGestureEvent,
    TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    cancelAnimation,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    scrollTo,
} from 'react-native-reanimated';
import { useBackHandler, useKeyboard } from '@react-native-community/hooks';

import {
    ColorVariants,
    Portal,
    useColorParts,
    useStatusBar,
} from '@tonlabs/uikit.hydrogen';

import { UIConstant } from '../constants';
import { getYWithRubberBandEffect } from '../AnimationHelpers/getYWithRubberBandEffect';
import { useHasScroll } from '../Scrollable';
import { ScrollableContext } from '../Scrollable/Context';

type OnClose = () => void | Promise<void>;

export type UISheetProps = {
    visible: boolean;
    onClose?: OnClose;
    countRubberBandDistance?: boolean;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

const RUBBER_BAND_EFFECT_DISTANCE = 50;

// eslint-disable-next-line no-shadow
enum SHOW_STATES {
    CLOSE = 0,
    CLOSING = 1,
    OPEN = 2,
    OPENING = 3,
    DRAG = 4,
}

const OpenSpringConfig = {
    overshootClamping: false,
    mass: 1,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    ...SpringConfig.fromBouncinessAndSpeed(8, 12),
};

const CloseSpringConfig = {
    overshootClamping: false,
    mass: 1,
    restSpeedThreshold: 100,
    restDisplacementThreshold: 40,
    ...SpringConfig.fromBouncinessAndSpeed(8, 12),
};

function useSheetHeight(countRubberBandDistance?: boolean) {
    const height = useSharedValue(0);
    const onSheetLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }) => {
            const newHeight = countRubberBandDistance
                ? lHeight - RUBBER_BAND_EFFECT_DISTANCE
                : lHeight;
            height.value = newHeight;
        },
        [height, countRubberBandDistance],
    );

    return {
        height,
        onSheetLayout,
    };
}

function useAnimatedKeyboard() {
    const keyboard = useKeyboard();
    const keyboardHeight = useSharedValue(keyboard.keyboardHeight);

    React.useEffect(() => {
        if (Platform.OS !== 'ios') {
            return;
        }
        keyboardHeight.value = keyboard.keyboardShown
            ? keyboard.keyboardHeight
            : 0;
    }, [keyboard.keyboardHeight, keyboard.keyboardShown, keyboardHeight]);

    return keyboardHeight;
}

function usePosition(
    height: Animated.SharedValue<number>,
    keyboardHeight: Animated.SharedValue<number>,
    onCloseProp: OnClose | undefined,
    onCloseModal: OnClose,
) {
    const showState = useSharedValue<SHOW_STATES>(SHOW_STATES.CLOSING);

    const animate = React.useCallback(
        (isShow: boolean) => {
            if (isShow) {
                showState.value = SHOW_STATES.OPEN;
                return;
            }
            showState.value = SHOW_STATES.CLOSE;
        },
        [showState],
    );

    const position = useSharedValue(0);

    const snapPointPosition = useDerivedValue(() => {
        return 0 - height.value - keyboardHeight.value;
    });

    useAnimatedReaction(
        () => {
            return {
                showState: showState.value,
                height: height.value,
                keyboardHeight: keyboardHeight.value,
                snapPointPosition: snapPointPosition.value,
            };
        },
        (currentState, prevState) => {
            // Sometimes we could be caught in a situation
            // when UISheet was asked to be closed (via visible=false)
            // and at the same time a keyboard was opened
            // so to prevent opening this guard is needed
            // (due to the fact that when sheet is open it's in OPENING state)
            if (
                currentState.showState === SHOW_STATES.OPENING &&
                prevState?.keyboardHeight !== currentState.keyboardHeight
            ) {
                cancelAnimation(position);
                showState.value = SHOW_STATES.OPEN;

                return;
            }

            if (currentState.height === 0) {
                return;
            }

            if (
                currentState.showState === SHOW_STATES.OPENING &&
                prevState?.height !== currentState.height
            ) {
                cancelAnimation(position);
                showState.value = SHOW_STATES.OPEN;

                return;
            }

            if (currentState.showState === SHOW_STATES.OPEN) {
                position.value = withSpring(
                    currentState.snapPointPosition,
                    OpenSpringConfig,
                );
                showState.value = SHOW_STATES.OPENING;

                return;
            }

            if (currentState.showState === SHOW_STATES.CLOSE) {
                position.value = withSpring(
                    0 - currentState.keyboardHeight,
                    CloseSpringConfig,
                    (isFinished) => {
                        if (isFinished && onCloseModal) {
                            runOnJS(onCloseModal)();
                        }
                    },
                );
                showState.value = SHOW_STATES.CLOSING;
            }
        },
    );

    const positionWithoutRubberBand = useSharedValue(0);

    const onTapGestureHandler = useAnimatedGestureHandler<
        TapGestureHandlerGestureEvent
    >({
        onActive: () => {
            showState.value = SHOW_STATES.CLOSE;
            if (onCloseProp) {
                runOnJS(onCloseProp)();
            }
        },
    });

    const yIsNegative = useSharedValue<boolean>(true);

    const adjustPosition = (y: number) => {
        'worklet';

        const intermediatePosition = position.value - y;

        if (y > 0 && intermediatePosition < snapPointPosition.value) {
            positionWithoutRubberBand.value += y;
            position.value =
                snapPointPosition.value -
                getYWithRubberBandEffect(
                    positionWithoutRubberBand.value,
                    RUBBER_BAND_EFFECT_DISTANCE,
                );

            return;
        }

        positionWithoutRubberBand.value = Math.max(
            positionWithoutRubberBand.value + y,
            0,
        );
        position.value = intermediatePosition;
    };

    const resetPosition = () => {
        'worklet';

        if (
            position.value - snapPointPosition.value >
            UIConstant.swipeThreshold
        ) {
            showState.value = SHOW_STATES.CLOSE;
            if (onCloseProp) {
                runOnJS(onCloseProp)();
            }
            return;
        }
        showState.value = SHOW_STATES.OPEN;
    };

    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const { y } = event.contentOffset;

            yIsNegative.value = y <= 0;

            const intermediatePosition = position.value - y;

            if (y <= 0 || intermediatePosition > snapPointPosition.value) {
                adjustPosition(y);
                scrollTo(scrollRef, 0, 0, false);
            }
        },
        onBeginDrag: () => {
            positionWithoutRubberBand.value = 0;
        },
        onEndDrag: () => {
            resetPosition();
        },
    });

    const { hasScroll, hasScrollShared, setHasScroll } = useHasScroll();

    const scrollGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        {
            translationY: number;
        }
    >({
        onActive: (event, ctx) => {
            const y = ctx.translationY - event.translationY;
            ctx.translationY = event.translationY;

            const intermediatePosition = position.value - y;

            if (!hasScrollShared.value) {
                if (y <= 0 || intermediatePosition > snapPointPosition.value) {
                    adjustPosition(y);
                    scrollTo(scrollRef, 0, 0, false);
                    return;
                }
            }

            if (yIsNegative.value && y <= 0) {
                adjustPosition(y);
            }
        },
        onStart: (_event, ctx) => {
            ctx.translationY = 0;
            positionWithoutRubberBand.value = 0;
        },
        onEnd: () => {
            resetPosition();
        },
    });

    const onPanGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        {
            translationY: number;
        }
    >({
        onActive: (event, ctx) => {
            const y = ctx.translationY - event.translationY;
            ctx.translationY = event.translationY;

            adjustPosition(y);
        },
        onStart: (_event, ctx) => {
            ctx.translationY = 0;
            positionWithoutRubberBand.value = 0;
        },
        onEnd: () => {
            resetPosition();
        },
    });

    return {
        animate,
        onTapGestureHandler,
        onPanGestureHandler,
        scrollRef,
        scrollHandler,
        scrollGestureHandler,
        hasScroll,
        setHasScroll,
        position,
    };
}

type UISheetPortalContentProps = UISheetProps & {
    onClosePortalRequest: () => void;
};

function UISheetPortalContent({
    visible,
    onClose,
    countRubberBandDistance,
    children,
    onClosePortalRequest,
    style,
}: UISheetPortalContentProps) {
    const { height, onSheetLayout } = useSheetHeight(countRubberBandDistance);
    const keyboardHeight = useAnimatedKeyboard();

    const {
        animate,
        onTapGestureHandler,
        onPanGestureHandler,
        scrollRef,
        scrollHandler,
        scrollGestureHandler,
        hasScroll,
        setHasScroll,
        position,
    } = usePosition(height, keyboardHeight, onClose, onClosePortalRequest);

    React.useEffect(() => {
        if (!visible) {
            animate(false);
            return;
        }

        requestAnimationFrame(() => animate(true));
    }, [visible, animate]);

    useBackHandler(() => {
        if (onClose) {
            onClose();
        } else {
            animate(false);
        }

        return true;
    });

    const {
        colorParts: overlayColorParts,
        opacity: overlayOpacity,
    } = useColorParts(ColorVariants.BackgroundOverlay);

    useStatusBar({
        backgroundColor: ColorVariants.BackgroundOverlay,
    });

    const overlayStyle = useAnimatedStyle(() => {
        return {
            flex: 1,
            // There was theoretically better for perf solution
            // with opacity, but on web it worked really bad
            // as it seems animated value need some time
            // to initialize before it's applied
            // and before it happen it shown provided background color
            // with default opacity (that is 1)
            backgroundColor: Animated.interpolateColor(
                position.value,
                [0, -height.value],
                [
                    `rgba(${overlayColorParts}, 0)`,
                    `rgba(${overlayColorParts}, ${overlayOpacity})`,
                ],
            ),
        };
    }, [overlayColorParts, overlayOpacity, height, position]);

    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: position.value,
                },
            ],
        };
    }, [position]);

    const scrollPanGestureHandlerRef = React.useRef<PanGestureHandler>(null);

    const scrollableContextValue = React.useMemo(
        () => ({
            ref: scrollRef,
            panGestureHandlerRef: scrollPanGestureHandlerRef,
            scrollHandler,
            gestureHandler: scrollGestureHandler,
            onWheel: null,
            hasScroll,
            setHasScroll,
            registerScrollable: null,
            unregisterScrollable: null,
        }),
        [
            scrollRef,
            scrollPanGestureHandlerRef,
            scrollHandler,
            scrollGestureHandler,
            hasScroll,
            setHasScroll,
        ],
    );

    return (
        <View style={styles.container}>
            <TapGestureHandler
                enabled={onClose != null}
                onGestureEvent={onTapGestureHandler}
            >
                {/* https://github.com/software-mansion/react-native-gesture-handler/issues/71 */}
                <Animated.View style={styles.interlayer}>
                    <PanGestureHandler
                        maxPointers={1}
                        enabled={onClose != null}
                        onGestureEvent={onPanGestureHandler}
                    >
                        <Animated.View style={overlayStyle} />
                    </PanGestureHandler>
                </Animated.View>
            </TapGestureHandler>

            <Animated.View
                style={[styles.sheet, cardStyle]}
                onLayout={onSheetLayout}
                pointerEvents="box-none"
            >
                <PanGestureHandler
                    maxPointers={1}
                    enabled={onClose != null}
                    onGestureEvent={onPanGestureHandler}
                    {...(Platform.OS === 'android' && hasScroll
                        ? { waitFor: scrollPanGestureHandlerRef }
                        : null)}
                >
                    <Animated.View style={style}>
                        <ScrollableContext.Provider
                            value={scrollableContextValue}
                        >
                            {children}
                        </ScrollableContext.Provider>
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </View>
    );
}

export function UISheet(props: UISheetProps) {
    const { visible } = props;
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (!visible) {
            return;
        }

        setIsVisible(true);
        // TODO: this hack should be removed
        // instead better to check keyboard height on mount
        Keyboard.dismiss();
    }, [visible, setIsVisible]);

    const onClosePortalRequest = React.useCallback(() => {
        setIsVisible(false);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <Portal absoluteFill>
            <UISheetPortalContent
                {...props}
                onClosePortalRequest={onClosePortalRequest}
            />
        </Portal>
    );
}

export type UICardSheetProps = UISheetProps & { style?: StyleProp<ViewStyle> };

export function UICardSheet({ children, style, ...rest }: UICardSheetProps) {
    const { bottom } = useSafeAreaInsets();
    return (
        <UISheet
            {...rest}
            style={[
                styles.card,
                {
                    paddingBottom: Math.max(bottom, UIConstant.contentOffset),
                },
            ]}
        >
            <View style={[style, styles.cardInner]}>{children}</View>
        </UISheet>
    );
}

export type UIBottomSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
};

export function UIBottomSheet({
    children,
    style,
    ...rest
}: UIBottomSheetProps) {
    return (
        <UISheet
            {...rest}
            countRubberBandDistance
            style={[
                styles.bottom,
                style,
                {
                    paddingBottom:
                        ((StyleSheet.flatten(style).paddingBottom as number) ??
                            0) + RUBBER_BAND_EFFECT_DISTANCE,
                },
            ]}
        >
            {children}
        </UISheet>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    interlayer: {
        flex: 1,
    },
    sheet: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
    },
    card: {
        width: '100%',
        maxWidth: UIConstant.elasticWidthCardSheet,
        alignSelf: 'center',
        paddingHorizontal: UIConstant.contentOffset,
    },
    cardInner: {
        width: '100%',
    },
    bottom: {
        width: '100%',
        maxWidth: UIConstant.elasticWidthBottomSheet,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
});
