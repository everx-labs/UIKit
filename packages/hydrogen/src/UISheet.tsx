import * as React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import {
    PanGestureHandler,
    TapGestureHandler,
    State as RNGHState,
} from 'react-native-gesture-handler';
import type { TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

import { useTheme, ColorVariants } from './Colors';
import { UIConstant } from './constants';
import { Portal } from './Portal';

type OnClose = () => void | Promise<void>;

export type UISheetProps = {
    visible: boolean;
    onClose?: OnClose;
    countRubberBandDistance?: boolean;
    children: React.ReactNode;
};

function useOverlay() {
    const theme = useTheme();

    return React.useMemo(() => {
        const rgbaRegex = /rgba\((\d+),\s+(\d+),\s+(\d+),\s+([\d.]+)\)/;
        const currentColor = theme[ColorVariants.BackgroundOverlay] as string;

        if (!rgbaRegex.test(currentColor)) {
            return {
                overlayColor: currentColor,
                overlayOpacity: 1,
            };
        }

        // @ts-ignore
        const [, red, green, blue, opacity] = currentColor.match(rgbaRegex);

        return {
            overlayColor: `rgb(${red}, ${green}, ${blue})`,
            overlayOpacity: Number(opacity),
        };
    }, [theme]);
}

const RUBBER_BAND_EFFECT_DISTANCE = 50;

function getYWithRubberBandEffect(
    currentPosition: Animated.Value<number>,
    translationY: Animated.Value<number>,
) {
    const { abs, sub, divide, add, multiply } = Animated;
    // Rubber band effect
    // https://medium.com/@esskeetit/как-работает-uiscrollview-2e7052032d97
    // (1 - 1 / (Math.abs(translationY) / d + 1)) * d;
    const y = multiply(
        sub(
            1,
            divide(
                1,
                add(divide(abs(translationY), RUBBER_BAND_EFFECT_DISTANCE), 1),
            ),
        ),
        RUBBER_BAND_EFFECT_DISTANCE,
    );

    return sub(currentPosition, y);
}

// eslint-disable-next-line no-shadow
enum SHOW_STATES {
    CLOSE = 0,
    CLOSING = 1,
    OPEN = 2,
    OPENING = 3,
    DRAG = 4,
}

function getPosition(
    clock: Animated.Clock,
    height: Animated.Value<number>,
    show: Animated.Value<number>,
    onCloseModal: () => void,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCloseProp: OnClose = () => {},
) {
    const {
        SpringUtils,
        block,
        cond,
        eq,
        set,
        spring,
        startClock,
        stopClock,
        clockRunning,
        // debug,
        sub,
        call,
        and,
        add,
        greaterThan,
    } = Animated;

    const state = {
        finished: new Animated.Value(0),
        velocity: new Animated.Value(0),
        position: new Animated.Value(0),
        time: new Animated.Value(0),
    };

    const config: Animated.SpringConfig = {
        // Default ones from https://reactnative.dev/docs/animated#spring
        ...SpringUtils.makeConfigFromBouncinessAndSpeed({
            overshootClamping: false,
            bounciness: 8,
            speed: 12,
            mass: new Animated.Value(1),
            restSpeedThreshold: new Animated.Value(0.001),
            restDisplacementThreshold: new Animated.Value(0.001),
            toValue: new Animated.Value(0),
        }),
    };

    const gestureState = new Animated.Value(-1);
    const dragY = new Animated.Value(0);

    const beforeDragPosition = new Animated.Value(0);

    return {
        value: block([
            cond(eq(height, 0), 0, [
                cond(
                    eq(gestureState, RNGHState.ACTIVE),
                    [
                        stopClock(clock),
                        set(show, SHOW_STATES.DRAG),
                        cond(
                            greaterThan(dragY, 0),
                            set(state.position, add(beforeDragPosition, dragY)),
                            set(
                                state.position,
                                getYWithRubberBandEffect(
                                    beforeDragPosition,
                                    dragY,
                                ),
                            ),
                        ),
                    ],
                    [
                        cond(
                            eq(show, SHOW_STATES.DRAG),
                            [
                                cond(
                                    greaterThan(
                                        dragY,
                                        UIConstant.swipeThreshold,
                                    ),
                                    [
                                        set(show, SHOW_STATES.CLOSE),
                                        call([], onCloseProp),
                                    ],
                                    set(show, SHOW_STATES.OPEN),
                                ),
                            ],
                            [
                                [
                                    set(beforeDragPosition, state.position),
                                    spring(clock, state, config),
                                ],
                            ],
                        ),
                    ],
                ),
                // Opening/Closing spring animation
                // All this blocks should be after gesture handling
                // because it changes `show` variable, that could affect this part
                cond(eq(show, SHOW_STATES.OPEN), [
                    set(state.finished, 0),
                    // @ts-ignore
                    set(config.restSpeedThreshold, 0.001),
                    // @ts-ignore
                    set(config.restDisplacementThreshold, 0.001),
                    // @ts-ignore
                    set(config.toValue, sub(0, height)),
                    set(show, SHOW_STATES.OPENING),
                    startClock(clock),
                ]),
                cond(eq(show, SHOW_STATES.CLOSE), [
                    set(state.finished, 0),
                    // @ts-ignore
                    set(config.restSpeedThreshold, 100),
                    // @ts-ignore
                    set(config.restDisplacementThreshold, 40),
                    // @ts-ignore
                    set(config.toValue, 0),
                    set(show, SHOW_STATES.CLOSING),
                    startClock(clock),
                ]),
                cond(and(state.finished, clockRunning(clock)), [
                    stopClock(clock),
                    // debug('stopped', show),
                    cond(eq(show, SHOW_STATES.CLOSING), call([], onCloseModal)),
                ]),
                state.position,
            ]),
        ]),
        onPan: Animated.event([
            {
                nativeEvent: {
                    state: gestureState,
                    translationY: dragY,
                },
            },
        ]),
    };
}

export function UISheet({
    visible,
    onClose,
    countRubberBandDistance,
    children,
}: UISheetProps) {
    const { overlayColor, overlayOpacity } = useOverlay();

    const [isVisible, setIsVisible] = React.useState(false);

    const heightValue = Animated.useValue(0);
    const clock = React.useRef(new Animated.Clock()).current;
    const show = Animated.useValue<SHOW_STATES>(SHOW_STATES.CLOSING);

    const { value, onPan } = getPosition(
        clock,
        heightValue,
        show,
        () => {
            setIsVisible(false);
        },
        onClose,
    );

    const positionRef = React.useRef(value);
    const onPanRef = React.useRef(onPan);

    const animate = React.useCallback(
        (isShow: boolean) => {
            if (isShow) {
                show.setValue(SHOW_STATES.OPEN);
                return;
            }
            show.setValue(SHOW_STATES.CLOSE);
        },
        [show],
    );

    React.useEffect(() => {
        if (!visible) {
            animate(false);
            return;
        }

        setIsVisible(true);
        requestAnimationFrame(() => animate(true));
    }, [visible, animate]);

    const onSheetLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }) => {
            const newHeight = countRubberBandDistance
                ? lHeight - RUBBER_BAND_EFFECT_DISTANCE
                : lHeight;
            heightValue.setValue(newHeight);
        },
        [heightValue, countRubberBandDistance],
    );

    const onTapStateChange = React.useCallback(
        ({ nativeEvent: { state } }: TapGestureHandlerStateChangeEvent) => {
            if (state === RNGHState.ACTIVE && onClose) {
                onClose();
            }
        },
        [onClose],
    );

    const overlayStyle = React.useMemo(
        () => ({
            flex: 1,
            backgroundColor: overlayColor,
            opacity: Animated.interpolate(positionRef.current, {
                inputRange: [Animated.sub(0, heightValue), 0],
                outputRange: [overlayOpacity, 0],
                extrapolate: Animated.Extrapolate.CLAMP,
            }),
        }),
        [overlayColor, overlayOpacity, heightValue],
    );

    const cardStyle = React.useMemo(
        () => [
            styles.sheet,
            {
                transform: [
                    {
                        translateY: positionRef.current,
                    },
                ],
            },
        ],
        [],
    );

    const panHandlerRef = React.useRef<PanGestureHandler>(null);

    const content = !isVisible ? null : (
        <View style={{ flex: 1, position: 'relative' }}>
            <TapGestureHandler
                enabled={onClose != null}
                waitFor={panHandlerRef}
                onHandlerStateChange={onTapStateChange}
            >
                {/* https://github.com/software-mansion/react-native-gesture-handler/issues/71 */}
                <Animated.View style={styles.interlayer}>
                    <PanGestureHandler
                        ref={panHandlerRef}
                        maxPointers={1}
                        enabled={onClose != null}
                        onGestureEvent={onPanRef.current}
                        onHandlerStateChange={onPanRef.current}
                    >
                        <Animated.View style={overlayStyle} />
                    </PanGestureHandler>
                </Animated.View>
            </TapGestureHandler>
            <PanGestureHandler
                maxPointers={1}
                enabled={onClose != null}
                onGestureEvent={onPanRef.current}
                onHandlerStateChange={onPanRef.current}
            >
                <Animated.View style={cardStyle} onLayout={onSheetLayout}>
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </View>
    );

    return <Portal>{content}</Portal>;
}

export type UICardSheetProps = UISheetProps & { style?: ViewStyle };

export function UICardSheet({ children, style, ...rest }: UICardSheetProps) {
    const { bottom } = useSafeAreaInsets();
    return (
        <UISheet {...rest}>
            <View
                style={[
                    styles.card,
                    {
                        paddingBottom: Math.max(
                            bottom,
                            UIConstant.contentOffset,
                        ),
                    },
                ]}
            >
                <View style={[style, styles.cardInner]}>{children}</View>
            </View>
        </UISheet>
    );
}

export type UIBottomSheetProps = UISheetProps & { style?: ViewStyle };

export function UIBottomSheet({
    children,
    style,
    ...rest
}: UIBottomSheetProps) {
    return (
        <UISheet {...rest} countRubberBandDistance>
            <View
                style={[
                    styles.bottom,
                    style,
                    {
                        paddingBottom:
                            ((StyleSheet.flatten(style)
                                .paddingBottom as number) ?? 0) +
                            RUBBER_BAND_EFFECT_DISTANCE,
                    },
                ]}
            >
                {children}
            </View>
        </UISheet>
    );
}

const styles = StyleSheet.create({
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
        paddingHorizontal: UIConstant.contentOffset,
    },
    cardInner: {
        width: '100%',
        maxWidth: UIConstant.elasticWidthCardSheet,
        alignSelf: 'center',
    },
    bottom: {
        width: '100%',
        maxWidth: UIConstant.elasticWidthBottomSheet,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
});
