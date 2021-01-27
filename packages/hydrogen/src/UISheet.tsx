import * as React from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

import {
    PanGestureHandler,
    TapGestureHandler,
    State as RNGHState,
} from 'react-native-gesture-handler';
import type {
    PanGestureHandlerGestureEvent,
    TapGestureHandlerStateChangeEvent,
    PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, ColorVariants } from './Colors';
import { UIConstant } from './constants';
import { Portal } from './Portal';

type UISheetProps = {
    visible: boolean;
    onClose?: () => void | Promise<void>;
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
    currentPosition: number,
    translationY: number,
) {
    // Rubber band effect
    // https://medium.com/@esskeetit/как-работает-uiscrollview-2e7052032d97
    const d = RUBBER_BAND_EFFECT_DISTANCE;
    const y = (1 - 1 / (Math.abs(translationY) / d + 1)) * d;
    return currentPosition - y;
}

export function UISheet({
    visible,
    onClose,
    countRubberBandDistance,
    children,
}: UISheetProps) {
    const { overlayColor, overlayOpacity } = useOverlay();

    const [isVisible, setIsVisible] = React.useState(false);
    const [height, setHeight] = React.useState(0);

    const positionRef = React.useRef(0);
    const positionAnimationRef = React.useRef(new Animated.Value(0));

    const springAnimationInProgressRef = React.useRef(false);

    const animate = React.useCallback(
        (show: boolean) => {
            // This protection is needed, because during spring animation
            // we don't know exact value of position
            // and if user will try to swipe at the moment we can't
            // set correct value
            springAnimationInProgressRef.current = true;
            positionRef.current = show ? -height : 0;

            Animated.spring(positionAnimationRef.current, {
                toValue: positionRef.current,
                ...(show
                    ? null
                    : {
                          // Spring animation finishing could take some time
                          // so tuning it up a little, more details here:
                          // https://github.com/facebook/react-native/issues/20783
                          restSpeedThreshold: 100,
                          restDisplacementThreshold: 40,
                      }),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (!finished) {
                    return;
                }
                springAnimationInProgressRef.current = false;
                positionAnimationRef.current.setValue(positionRef.current);
                // Need to get a time for animation, before unmount it
                if (!show) {
                    setIsVisible(false);
                }
            });
        },
        [height],
    );

    const shouldAnimate = React.useRef(false);

    React.useEffect(() => {
        if (shouldAnimate.current) {
            animate(true);
            shouldAnimate.current = false;
        }
    }, [height, animate]);

    React.useEffect(() => {
        if (!visible) {
            animate(false);
            return;
        }

        setIsVisible(true);
        if (height > 0) {
            animate(true);
        }
    }, [visible, animate, height]);

    const onSheetLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }) => {
            if (height === 0) {
                setHeight(
                    countRubberBandDistance
                        ? lHeight - RUBBER_BAND_EFFECT_DISTANCE
                        : lHeight,
                );
            }
        },
        [height, countRubberBandDistance],
    );

    const onReleasePan = React.useCallback(
        (dy: number) => {
            if (dy > UIConstant.swipeThreshold) {
                onClose && onClose();
            } else {
                animate(true);
            }
        },
        [onClose, animate],
    );

    const onPan = React.useCallback(
        ({ nativeEvent: { translationY } }: PanGestureHandlerGestureEvent) => {
            if (springAnimationInProgressRef.current) {
                return;
            }
            if (translationY > 0) {
                positionAnimationRef.current.setValue(
                    positionRef.current + translationY,
                );
                return;
            }

            positionAnimationRef.current.setValue(
                getYWithRubberBandEffect(positionRef.current, translationY),
            );
        },
        [],
    );

    const onPanStateChange = React.useCallback(
        ({
            nativeEvent: { state, translationY },
        }: PanGestureHandlerStateChangeEvent) => {
            if (
                (!springAnimationInProgressRef.current &&
                    state === RNGHState.END) ||
                state === RNGHState.CANCELLED
            ) {
                onReleasePan(translationY);
            }
        },
        [onReleasePan],
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
            opacity: positionAnimationRef.current.interpolate({
                inputRange: [-height, 0],
                outputRange: [overlayOpacity, 0],
                extrapolate: 'clamp',
            }),
        }),
        [overlayColor, overlayOpacity, height],
    );

    const cardStyle = React.useMemo(
        () => [
            styles.sheet,
            {
                transform: [
                    {
                        translateY: positionAnimationRef.current,
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
                <PanGestureHandler
                    enabled={onClose != null}
                    ref={panHandlerRef}
                    onGestureEvent={onPan}
                    onHandlerStateChange={onPanStateChange}
                >
                    <Animated.View style={overlayStyle} />
                </PanGestureHandler>
            </TapGestureHandler>
            <PanGestureHandler
                enabled={onClose != null}
                onGestureEvent={onPan}
                onHandlerStateChange={onPanStateChange}
            >
                <Animated.View style={cardStyle} onLayout={onSheetLayout}>
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </View>
    );

    return <Portal>{content}</Portal>;
}

export function UICardSheet({
    children,
    style,
    ...rest
}: UISheetProps & { style?: ViewStyle }) {
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
                <View style={style}>{children}</View>
            </View>
        </UISheet>
    );
}

export function UIBottomSheet({
    children,
    style,
    ...rest
}: UISheetProps & { style?: ViewStyle }) {
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
    sheet: {
        position: 'absolute',
        top: '100%',
        width: '100%',
    },
    card: {
        width: '100%',
        maxWidth: UIConstant.elasticWidthHalfNormal,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
    bottom: {
        width: '100%',
        // maxWidth: UIConstant.elasticWidthHalfNormal,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
});
