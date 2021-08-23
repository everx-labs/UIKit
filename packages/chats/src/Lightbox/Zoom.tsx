/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedRef,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
} from 'react-native-reanimated';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PinchGestureHandler,
    PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import type { ZoomProps } from './types';

const platform = Platform.OS;

const deceleration = 0.995;

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

export const Zoom: React.FC<ZoomProps> = ({
    children,
    initialWidth,
    initialHeight,
    openedImageScale,
}: ZoomProps) => {
    const pinchRef = useAnimatedRef();
    const panRef = useAnimatedRef();

    const baseScale = useSharedValue<number>(1);
    const scale = useSharedValue<number>(1);
    const isZooming = useSharedValue<boolean>(false);
    const focalX = useSharedValue<number>(0);
    const focalY = useSharedValue<number>(0);
    const translationX = useSharedValue<number>(0);
    const translationY = useSharedValue<number>(0);

    const onPinchGestureEvent = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
        onActive: event => {
            if (!isZooming.value) {
                isZooming.value = true;
            }
            if (!focalX.value) {
                focalX.value = event.focalX;
            }
            if (!focalY.value) {
                focalY.value = event.focalY;
            }
            scale.value = event.scale;
        },
        onEnd: event => {
            translationX.value +=
                ((focalX.value * openedImageScale.value - initialWidth.value / 2) *
                    (1 - scale.value)) /
                scale.value /
                baseScale.value /
                openedImageScale.value;
            translationY.value +=
                ((focalY.value * openedImageScale.value - initialHeight.value / 2) *
                    (1 - scale.value)) /
                scale.value /
                baseScale.value /
                openedImageScale.value;

            isZooming.value = false;
            baseScale.value *= event.scale;
            focalX.value = 0;
            focalY.value = 0;
        },
    });

    const onPanGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        PanGestureEventContext
    >({
        onStart: (_, context) => {
            context.startX = translationX.value;
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
                deceleration,
                clamp: [-maxTranslation.x, maxTranslation.x],
            });
            translationY.value = withDecay({
                velocity: event.velocityY / baseScale.value,
                deceleration,
                clamp: [-maxTranslation.y, maxTranslation.y],
            });
        },
    });

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

    const dot = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: 'blue',
            top: -5,
            left: -5,
            transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
        };
    });

    return (
        <Animated.View style={styles.pinchContainer}>
            <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={onPinchGestureEvent}
                simultaneousHandlers={panRef}
                minPointers={2}
            >
                <Animated.View style={styles.panContainer}>
                    <PanGestureHandler
                        ref={panRef}
                        onGestureEvent={onPanGestureEvent}
                        simultaneousHandlers={pinchRef}
                        enableTrackpadTwoFingerGesture={false}
                        maxPointers={1}
                    >
                        <Animated.View style={[styles.content, animatedStyle]}>
                            {children}
                        </Animated.View>
                    </PanGestureHandler>
                    <Animated.View style={dot} />
                </Animated.View>
            </PinchGestureHandler>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    pinchContainer: {
        // borderWidth: 1,
    },
    panContainer: {
        // borderWidth: 1,
    },
    content: {
        // borderWidth: 1,
    },
});
