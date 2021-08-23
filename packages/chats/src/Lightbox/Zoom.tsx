import * as React from 'react';
import { Platform } from 'react-native';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedRef,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
    withSpring,
} from 'react-native-reanimated';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PinchGestureHandler,
    PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import type { ZoomProps } from './types';

const platform = Platform.OS;

const DECELERATION = 0.995;
const INITIAL_VALUE = -1;

const springConfig: Animated.WithSpringConfig = {
    overshootClamping: true,
    stiffness: 500,
};

type PanGestureEventContext = {
    startX: number;
    startY: number;
};

const runUIGetMaxTranslation = (
    initialWidth: number,
    initialHeight: number,
    scale: number,
    openedImageScale: number,
) => {
    'worklet';

    if (scale <= 1) {
        return {
            x: 0,
            y: 0,
        };
    }
    return {
        x: (initialWidth * (scale - 1)) / 2 / scale / openedImageScale,
        y: (initialHeight * (scale - 1)) / 2 / scale / openedImageScale,
    };
};

const runUIGetScaleResultOffset = (
    focalCoordinate: Readonly<Animated.SharedValue<number>>,
    initialSize: Readonly<Animated.SharedValue<number>>,
    scale: Readonly<Animated.SharedValue<number>>,
    baseScale: Readonly<Animated.SharedValue<number>>,
    openedImageScale: Readonly<Animated.SharedValue<number>>,
) => {
    'worklet';

    return (
        ((focalCoordinate.value * openedImageScale.value - initialSize.value / 2) *
            (1 - scale.value)) /
        scale.value /
        baseScale.value /
        openedImageScale.value
    );
};

export const Zoom: React.FC<ZoomProps> = ({
    children,
    initialWidth,
    initialHeight,
    openedImageScale,
}: ZoomProps) => {
    const pinchRef = useAnimatedRef();
    const panRef = useAnimatedRef();

    /**
     * Last scale
     */
    const baseScale = useSharedValue<number>(1);
    /**
     * Scale of current pinch
     */
    const scale = useSharedValue<number>(1);
    /**
     * Is pinch active
     */
    const isZooming = useSharedValue<boolean>(false);
    /**
     * X coordinate of current pinch focus
     */
    const focalX = useSharedValue<number>(INITIAL_VALUE);
    /**
     * Y coordinate of current pinch focus
     */
    const focalY = useSharedValue<number>(INITIAL_VALUE);
    /**
     * Current X offset from the center position
     */
    const translationX = useSharedValue<number>(0);
    /**
     * Current Y offset from the center position
     */
    const translationY = useSharedValue<number>(0);

    const onZoom = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
        onActive: event => {
            if (!isZooming.value) {
                isZooming.value = true;
            }
            if (focalX.value === INITIAL_VALUE) {
                focalX.value = event.focalX;
            }
            if (focalY.value === INITIAL_VALUE) {
                focalY.value = event.focalY;
            }
            scale.value = event.scale;
        },
        onEnd: event => {
            /**
             * Save the translation after the zoom
             */
            const resultOffsetX = runUIGetScaleResultOffset(
                focalX,
                initialWidth,
                scale,
                baseScale,
                openedImageScale,
            );
            const resultOffsetY = runUIGetScaleResultOffset(
                focalY,
                initialHeight,
                scale,
                baseScale,
                openedImageScale,
            );
            translationX.value += resultOffsetX;
            translationY.value += resultOffsetY;

            /**
             * Reset zooming values
             */
            isZooming.value = false;
            baseScale.value *= event.scale;
            focalX.value = INITIAL_VALUE;
            focalY.value = INITIAL_VALUE;

            /**
             * Fill the screen with a picture
             */
            const maxTranslation = runUIGetMaxTranslation(
                initialWidth.value,
                initialHeight.value,
                baseScale.value,
                openedImageScale.value,
            );

            if (translationX.value < -maxTranslation.x) {
                translationX.value = withSpring(-maxTranslation.x, springConfig);
            } else if (translationX.value > maxTranslation.x) {
                translationX.value = withSpring(maxTranslation.x, springConfig);
            }

            if (translationY.value < -maxTranslation.y) {
                translationY.value = withSpring(-maxTranslation.y, springConfig);
            } else if (translationY.value > maxTranslation.y) {
                translationY.value = withSpring(maxTranslation.y, springConfig);
            }
        },
    });

    const onMove = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, PanGestureEventContext>(
        {
            onStart: (_, context) => {
                // eslint-disable-next-line no-param-reassign
                context.startX = translationX.value;
                // eslint-disable-next-line no-param-reassign
                context.startY = translationY.value;
            },
            onActive: (event, context) => {
                const transX =
                    platform === 'android'
                        ? event.translationX / openedImageScale.value / baseScale.value
                        : event.translationX;
                const transY =
                    platform === 'android'
                        ? event.translationY / openedImageScale.value / baseScale.value
                        : event.translationY;
                const targetX = context.startX + transX;
                const targetY = context.startY + transY;
                const maxTranslation = runUIGetMaxTranslation(
                    initialWidth.value,
                    initialHeight.value,
                    baseScale.value,
                    openedImageScale.value,
                );

                if (targetX < -maxTranslation.x) {
                    translationX.value = -maxTranslation.x;
                } else if (targetX > maxTranslation.x) {
                    translationX.value = maxTranslation.x;
                } else {
                    translationX.value = targetX;
                }

                if (targetY < -maxTranslation.y) {
                    translationY.value = -maxTranslation.y;
                } else if (targetY > maxTranslation.y) {
                    translationY.value = maxTranslation.y;
                } else {
                    translationY.value = targetY;
                }
            },
            onEnd: event => {
                const maxTranslation = runUIGetMaxTranslation(
                    initialWidth.value,
                    initialHeight.value,
                    baseScale.value,
                    openedImageScale.value,
                );
                translationX.value = withDecay({
                    velocity: event.velocityX / baseScale.value,
                    deceleration: DECELERATION,
                    clamp: [-maxTranslation.x, maxTranslation.x],
                });
                translationY.value = withDecay({
                    velocity: event.velocityY / baseScale.value,
                    deceleration: DECELERATION,
                    clamp: [-maxTranslation.y, maxTranslation.y],
                });
            },
        },
    );

    const animatedStyle = useAnimatedStyle(() => {
        const translate = [
            { scale: baseScale.value },
            { translateX: translationX.value },
            { translateY: translationY.value },
        ];

        const zoom = isZooming.value
            ? [
                  { translateX: focalX.value },
                  { translateY: focalY.value },
                  { translateX: -initialWidth.value / openedImageScale.value / 2 },
                  { translateY: -initialHeight.value / openedImageScale.value / 2 },
                  { scale: scale.value },
                  { translateX: -focalX.value },
                  { translateY: -focalY.value },
                  { translateX: initialWidth.value / openedImageScale.value / 2 },
                  { translateY: initialHeight.value / openedImageScale.value / 2 },
              ]
            : [];

        return {
            transform: [...zoom, ...translate],
        };
    });

    return (
        <Animated.View>
            <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={onZoom}
                simultaneousHandlers={panRef}
                minPointers={2}
            >
                <Animated.View>
                    <PanGestureHandler
                        ref={panRef}
                        onGestureEvent={onMove}
                        simultaneousHandlers={pinchRef}
                        enableTrackpadTwoFingerGesture={false}
                        maxPointers={1}
                    >
                        <Animated.View style={animatedStyle}>{children}</Animated.View>
                    </PanGestureHandler>
                </Animated.View>
            </PinchGestureHandler>
        </Animated.View>
    );
};
