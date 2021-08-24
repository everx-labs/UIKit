/* eslint-disable no-param-reassign */
import { Platform } from 'react-native';
import type {
    PanGestureHandlerGestureEvent,
    PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    withDecay,
    withSpring,
} from 'react-native-reanimated';
import type { PanGestureEventContext } from '../types';

const platform = Platform.OS;

const DECELERATION = 0.995;

const springConfig: Animated.WithSpringConfig = {
    overshootClamping: true,
    stiffness: 500,
};

const runUIGetScaleResultOffset = (
    focalCoordinate: Readonly<Animated.SharedValue<number>>,
    initialSize: number,
    scale: Readonly<Animated.SharedValue<number>>,
    baseScale: Readonly<Animated.SharedValue<number>>,
) => {
    'worklet';

    return (
        ((focalCoordinate.value - initialSize / 2) * (1 - scale.value)) /
        scale.value /
        baseScale.value
    );
};

const runUIGetMaxTranslation = (
    windowWidth: number,
    windowHeight: number,
    contentWidth: Readonly<Animated.SharedValue<number>>,
    contentHeight: Readonly<Animated.SharedValue<number>>,
    scale: number,
) => {
    'worklet';

    let x = 0;
    const currentWidth = contentWidth.value * scale;
    if (currentWidth > windowWidth) {
        x = (currentWidth - windowWidth) / 2 / scale;
    } else {
        x = 0;
    }

    let y = 0;
    const currentHeight = contentHeight.value * scale;
    if (currentHeight > windowHeight) {
        y = (currentHeight - windowHeight) / 2 / scale;
    } else {
        y = 0;
    }

    return { x, y };
};

export const useOnZoom = (
    isZooming: Animated.SharedValue<boolean>,
    focalX: Animated.SharedValue<number>,
    focalY: Animated.SharedValue<number>,
    scale: Animated.SharedValue<number>,
    initialValue: number,
    windowWidth: number,
    windowHeight: number,
    baseScale: Animated.SharedValue<number>,
    translationX: Animated.SharedValue<number>,
    translationY: Animated.SharedValue<number>,
    contentWidth: Readonly<Animated.SharedValue<number>>,
    contentHeight: Readonly<Animated.SharedValue<number>>,
) => {
    return useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>(
        {
            onActive: event => {
                if (!isZooming.value) {
                    isZooming.value = true;
                }
                if (focalX.value === initialValue) {
                    focalX.value = event.focalX;
                }
                if (focalY.value === initialValue) {
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
                    windowWidth,
                    scale,
                    baseScale,
                );
                const resultOffsetY = runUIGetScaleResultOffset(
                    focalY,
                    windowHeight,
                    scale,
                    baseScale,
                );
                translationX.value += resultOffsetX;
                translationY.value += resultOffsetY;

                /**
                 * Reset zooming values
                 */
                isZooming.value = false;
                baseScale.value *= event.scale;
                focalX.value = initialValue;
                focalY.value = initialValue;

                /**
                 * Fill the screen with a picture
                 */
                const maxTranslation = runUIGetMaxTranslation(
                    windowWidth,
                    windowHeight,
                    contentWidth,
                    contentHeight,
                    baseScale.value,
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
        },
        [windowWidth, windowHeight],
    );
};

export const useOnMove = (
    windowWidth: number,
    windowHeight: number,
    baseScale: Animated.SharedValue<number>,
    translationX: Animated.SharedValue<number>,
    translationY: Animated.SharedValue<number>,
    contentWidth: Readonly<Animated.SharedValue<number>>,
    contentHeight: Readonly<Animated.SharedValue<number>>,
) => {
    return useAnimatedGestureHandler<PanGestureHandlerGestureEvent, PanGestureEventContext>(
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
                        ? event.translationX / baseScale.value
                        : event.translationX;
                const transY =
                    platform === 'android'
                        ? event.translationY / baseScale.value
                        : event.translationY;
                const targetX = context.startX + transX;
                const targetY = context.startY + transY;
                const maxTranslation = runUIGetMaxTranslation(
                    windowWidth,
                    windowHeight,
                    contentWidth,
                    contentHeight,
                    baseScale.value,
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
                    windowWidth,
                    windowHeight,
                    contentWidth,
                    contentHeight,
                    baseScale.value,
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
        [windowWidth, windowHeight],
    );
};

export const useZoomStyle = (
    isZooming: Animated.SharedValue<boolean>,
    focalX: Animated.SharedValue<number>,
    focalY: Animated.SharedValue<number>,
    scale: Animated.SharedValue<number>,
    windowWidth: number,
    windowHeight: number,
    baseScale: Animated.SharedValue<number>,
    translationX: Animated.SharedValue<number>,
    translationY: Animated.SharedValue<number>,
) => {
    return useAnimatedStyle(() => {
        const zoom = isZooming.value
            ? [
                  { translateX: focalX.value },
                  { translateY: focalY.value },
                  { translateX: -windowWidth / 2 },
                  { translateY: -windowHeight / 2 },
                  { scale: scale.value },
                  { translateX: -focalX.value },
                  { translateY: -focalY.value },
                  { translateX: windowWidth / 2 },
                  { translateY: windowHeight / 2 },
              ]
            : [];

        const translate = [
            { scale: baseScale.value },
            { translateX: translationX.value },
            { translateY: translationY.value },
        ];

        return {
            transform: zoom.concat(translate),
        };
    }, [windowWidth, windowHeight]);
};
