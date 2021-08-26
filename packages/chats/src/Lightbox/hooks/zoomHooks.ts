/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Platform } from 'react-native';
import type {
    PanGestureHandlerGestureEvent,
    PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useAnimatedStyle,
    withDecay,
    withSpring,
} from 'react-native-reanimated';
import type { PanGestureEventContext } from '../types';
import { UIConstant } from '../../constants';

const platform = Platform.OS;

const springConfig: Animated.WithSpringConfig = {
    overshootClamping: true,
    stiffness: 100,
};

const runUIGetScaleResultOffset = (
    focalCoordinate: Readonly<Animated.SharedValue<number>>,
    initialSize: number,
    scale: number,
    baseScale: Readonly<Animated.SharedValue<number>>,
) => {
    'worklet';

    return ((focalCoordinate.value - initialSize / 2) * (1 - scale)) / scale / baseScale.value;
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

const applyAnimationEndCallback = (callback: () => void) => {
    'worklet';

    return (isFinished: boolean) => {
        'worklet';

        if (isFinished) {
            runOnJS(callback)();
        }
    };
};

export const useOnZoom = (
    isZooming: Animated.SharedValue<boolean>,
    isMoving: Animated.SharedValue<boolean>,
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
    const onAnimationEnd = React.useCallback(() => {
        if (isZooming.value) {
            isZooming.value = false;
        }
    }, [isZooming]);

    return useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>(
        {
            onActive: event => {
                if (!isZooming.value) {
                    isZooming.value = true;
                }
                if (isMoving.value) {
                    isMoving.value = false;
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
                scale.value = event.scale;

                /**
                 * Save the translation after the zoom
                 */
                const resultOffsetX = runUIGetScaleResultOffset(
                    focalX,
                    windowWidth,
                    event.scale,
                    baseScale,
                );
                const resultOffsetY = runUIGetScaleResultOffset(
                    focalY,
                    windowHeight,
                    event.scale,
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
                 * If the scale is less than one, then we make it equal to one
                 */
                if (baseScale.value < 1) {
                    baseScale.value = withSpring(1, springConfig);
                }

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
                    translationY.value = withSpring(
                        -maxTranslation.y,
                        springConfig,
                        applyAnimationEndCallback(onAnimationEnd),
                    );
                } else if (translationY.value > maxTranslation.y) {
                    translationY.value = withSpring(
                        maxTranslation.y,
                        springConfig,
                        applyAnimationEndCallback(onAnimationEnd),
                    );
                }

                if (
                    translationX.value >= -maxTranslation.x &&
                    translationX.value <= maxTranslation.x &&
                    translationY.value >= -maxTranslation.y &&
                    translationY.value <= maxTranslation.y
                ) {
                    runOnJS(onAnimationEnd)();
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
    onClose: () => void,
    isZooming: Animated.SharedValue<boolean>,
    isMoving: Animated.SharedValue<boolean>,
) => {
    const onAnimationEnd = React.useCallback(() => {
        if (isMoving.value) {
            isMoving.value = false;
        }
    }, [isMoving]);

    return useAnimatedGestureHandler<PanGestureHandlerGestureEvent, PanGestureEventContext>(
        {
            onStart: (_, context) => {
                if (isZooming.value) {
                    return;
                }

                context.startX = translationX.value;
                context.startY = translationY.value;
            },
            onActive: (event, context) => {
                if (isZooming.value) {
                    return;
                }
                if (!isMoving.value) {
                    isMoving.value = true;
                }

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

                if (baseScale.value <= 1) {
                    translationY.value = targetY;
                } else {
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
                if (baseScale.value <= 1) {
                    translationX.value = withSpring(0, springConfig);
                    translationY.value = withSpring(
                        0,
                        springConfig,
                        applyAnimationEndCallback(onAnimationEnd),
                    );

                    const absoluteTranslationX =
                        platform === 'android'
                            ? Math.abs(event.translationY)
                            : Math.abs(event.translationY) * baseScale.value;

                    if (
                        absoluteTranslationX >
                        windowHeight * UIConstant.lightbox.swipeToCloseThreshold
                    ) {
                        runOnJS(onClose)();
                    }
                } else {
                    translationX.value = withDecay({
                        velocity: event.velocityX / baseScale.value,
                        deceleration: UIConstant.lightbox.moveDeceleration,
                        clamp: [-maxTranslation.x, maxTranslation.x],
                    });
                    translationY.value = withDecay(
                        {
                            velocity: event.velocityY / baseScale.value,
                            deceleration: UIConstant.lightbox.moveDeceleration,
                            clamp: [-maxTranslation.y, maxTranslation.y],
                        },
                        applyAnimationEndCallback(onAnimationEnd),
                    );
                }
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

export const useUnderlayOpacityTransitions = (
    translationY: Animated.SharedValue<number>,
    baseScale: Animated.SharedValue<number>,
    underlayOpacity: Animated.SharedValue<number>,
    windowHeight: number,
    isMoving: Animated.SharedValue<boolean>,
) => {
    useAnimatedReaction(
        () => {
            return {
                translationY: translationY.value,
                baseScale: baseScale.value,
                isMoving: isMoving.value,
            };
        },
        state => {
            if (state.baseScale <= 1 && state.isMoving) {
                underlayOpacity.value =
                    1 - (Math.abs(translationY.value) * baseScale.value) / (windowHeight / 2);
            } else if (underlayOpacity.value !== 1) {
                underlayOpacity.value = withSpring(1, springConfig);
            }
        },
        [windowHeight],
    );
};
