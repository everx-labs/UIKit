import * as React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';

import {
    PanGestureHandler,
    TapGestureHandler,
    State as RNGHState,
} from 'react-native-gesture-handler';
import type { TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useBackHandler, useKeyboard } from '@react-native-community/hooks';

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
            overlayColorParts: `${red}, ${green}, ${blue}`,
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
    height: Animated.Value<number>,
    keyboardHeight: Animated.Value<number>,
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
        neq,
        set,
        spring,
        startClock,
        stopClock,
        clockRunning,
        sub,
        call,
        and,
        add,
        greaterThan,
    } = Animated;

    const clock = new Animated.Clock();

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
    const beforeKeyboardHeight = new Animated.Value(0);

    return {
        value: block([
            cond(neq(beforeKeyboardHeight, keyboardHeight), [
                // OPEN gonna start spring animation
                set(show, SHOW_STATES.OPEN),
                set(beforeKeyboardHeight, keyboardHeight),
            ]),
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
                    set(
                        // @ts-ignore
                        config.toValue,
                        sub(0, add(height, beforeKeyboardHeight)),
                    ),
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
                    set(config.toValue, sub(0, beforeKeyboardHeight)),
                    set(show, SHOW_STATES.CLOSING),
                    startClock(clock),
                ]),
                cond(and(state.finished, clockRunning(clock)), [
                    stopClock(clock),
                    // Animated.debug('stopped', show),
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

function usePosition(
    height: Animated.Value<number>,
    keyboardHeight: Animated.Value<number>,
    onCloseProp: OnClose | undefined,
    onCloseModal: OnClose,
) {
    const show = Animated.useValue<SHOW_STATES>(SHOW_STATES.CLOSING);

    const { value, onPan } = getPosition(
        height,
        keyboardHeight,
        show,
        onCloseModal,
        onCloseProp,
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

    return {
        animate,
        position: positionRef.current,
        onPan: onPanRef.current,
    };
}

function useAnimatedKeyboard() {
    const keyboard = useKeyboard();
    const keyboardHeightValue = Animated.useValue(keyboard.keyboardHeight);

    React.useEffect(() => {
        if (Platform.OS !== 'ios') {
            return;
        }
        keyboardHeightValue.setValue(
            keyboard.keyboardShown ? keyboard.keyboardHeight : 0,
        );
    }, [keyboard.keyboardHeight, keyboardHeightValue, keyboard.keyboardShown]);

    return keyboardHeightValue;
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
}: UISheetPortalContentProps) {
    const heightValue = Animated.useValue(0);
    const { overlayColorParts, overlayOpacity } = useOverlay();
    const keyboardHeightValue = useAnimatedKeyboard();

    const { animate, position, onPan } = usePosition(
        heightValue,
        keyboardHeightValue,
        onClose,
        onClosePortalRequest,
    );

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

    // @ts-ignore TS doesn't understand when backgroundColor is animated node
    const overlayStyle: ViewStyle = React.useMemo(
        () => ({
            flex: 1,
            // There was theretically better for perf solution
            // with opacity, but on web it worked really bad
            // as it seems animated value need some time
            // to initialize before it's applied
            // and before it happen it shown provided background color
            // with default opacity (that is 1)
            backgroundColor: Animated.interpolateColors(
                Animated.abs(position),
                {
                    inputRange: [0, heightValue],
                    outputColorRange: [
                        `rgba(${overlayColorParts}, 0)`,
                        `rgba(${overlayColorParts}, ${overlayOpacity})`,
                    ],
                },
            ),
        }),
        [overlayColorParts, overlayOpacity, heightValue, position],
    );

    const cardStyle = React.useMemo(
        () => [
            styles.sheet,
            {
                transform: [
                    {
                        translateY: position,
                    },
                ],
            },
        ],
        [position],
    );

    return (
        <View style={styles.container}>
            <TapGestureHandler
                enabled={onClose != null}
                onHandlerStateChange={onTapStateChange}
            >
                {/* https://github.com/software-mansion/react-native-gesture-handler/issues/71 */}
                <Animated.View style={styles.interlayer}>
                    <PanGestureHandler
                        maxPointers={1}
                        enabled={onClose != null}
                        onGestureEvent={onPan}
                        onHandlerStateChange={onPan}
                    >
                        <Animated.View style={overlayStyle} />
                    </PanGestureHandler>
                </Animated.View>
            </TapGestureHandler>
            <PanGestureHandler
                maxPointers={1}
                enabled={onClose != null}
                onGestureEvent={onPan}
                onHandlerStateChange={onPan}
            >
                <Animated.View style={cardStyle} onLayout={onSheetLayout}>
                    {children}
                </Animated.View>
            </PanGestureHandler>
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
    }, [visible, setIsVisible]);

    const onClosePortalRequest = React.useCallback(() => {
        setIsVisible(false);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <Portal>
            <UISheetPortalContent
                {...props}
                onClosePortalRequest={onClosePortalRequest}
            />
        </Portal>
    );
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
