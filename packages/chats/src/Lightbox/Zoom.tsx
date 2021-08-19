/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Platform } from 'react-native';
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
type PinchGestureEventContext = {
    startScale: number;
};

const runUIGetTranslate = (
    translationX: number,
    translationY: number,
    scale: number,
    openedImageScale: number,
) => {
    'worklet';

    switch (platform) {
        case 'android':
            return [
                { translateX: translationX / openedImageScale / scale },
                { translateY: translationY / openedImageScale / scale },
            ];
        default:
            return [{ translateX: translationX }, { translateY: translationY }];
    }
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

    switch (platform) {
        case 'android':
            return {
                x: (initialWidth * (scale - 1)) / 2,
                y: (initialHeight * (scale - 1)) / 2,
            };
        default:
            return {
                x: (initialWidth * (scale - 1)) / 2 / scale / openedImageScale,
                y: (initialHeight * (scale - 1)) / 2 / scale / openedImageScale,
            };
    }
};

export const Zoom: React.FC<ZoomProps> = ({
    children,
    initialWidth,
    initialHeight,
    openedImageScale,
}: ZoomProps) => {
    const pinchRef = useAnimatedRef();
    const panRef = useAnimatedRef();

    const scale = useSharedValue<number>(1);
    const isZooming = useSharedValue<boolean>(false);
    const focalX = useSharedValue<number>(0);
    const focalY = useSharedValue<number>(0);
    const translationX = useSharedValue<number>(0);
    const translationY = useSharedValue<number>(0);

    const onPinchGestureEvent = useAnimatedGestureHandler<
        PinchGestureHandlerGestureEvent,
        PinchGestureEventContext
    >({
        onStart: (_event, context) => {
            context.startScale = scale.value;
            isZooming.value = true;
        },
        onActive: (event, context) => {
            scale.value = context.startScale * event.scale;
            if (!focalX.value) {
                focalX.value = event.focalX;
            }
            if (!focalY.value) {
                focalY.value = event.focalY;
            }
        },
        onEnd: () => {
            // const targetX = context.startX + event.translationX;
            // const targetY = context.startY + event.translationY;

            switch (platform) {
                case 'android':
                    translationX.value +=
                        focalX.value * (1 - scale.value) * openedImageScale.value * scale.value;
                    translationY.value +=
                        focalY.value * (1 - scale.value) * openedImageScale.value * scale.value;
                    break;
                default:
                    translationX.value +=
                        focalX.value *
                        (1 - scale.value) *
                        openedImageScale.value *
                        openedImageScale.value *
                        (1 - scale.value);
                    translationY.value +=
                        focalY.value *
                        (1 - scale.value) *
                        openedImageScale.value *
                        openedImageScale.value *
                        (1 - scale.value);
                    break;
            }

            isZooming.value = false;
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
            const targetX = context.startX + event.translationX;
            const targetY = context.startY + event.translationY;
            const maxTranslation = runUIGetMaxTranslation(
                initialWidth.value,
                initialHeight.value,
                scale.value,
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
                scale.value,
                openedImageScale.value,
            );
            translationX.value = withDecay({
                velocity: event.velocityX / scale.value,
                deceleration,
                clamp: [-maxTranslation.x, maxTranslation.x],
            });
            translationY.value = withDecay({
                velocity: event.velocityY / scale.value,
                deceleration,
                clamp: [-maxTranslation.y, maxTranslation.y],
            });
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        const translate = runUIGetTranslate(
            translationX.value,
            translationY.value,
            scale.value,
            openedImageScale.value,
        );
        if (isZooming.value) {
            return {
                transform: [
                    { translateX: focalX.value },
                    { translateY: focalY.value },
                    { translateX: -initialWidth.value / openedImageScale.value / 2 },
                    { translateY: -initialHeight.value / openedImageScale.value / 2 },
                    { scale: scale.value },
                    { translateX: -focalX.value },
                    { translateY: -focalY.value },
                    { translateX: initialWidth.value / openedImageScale.value / 2 },
                    { translateY: initialHeight.value / openedImageScale.value / 2 },

                    ...translate,
                ],
            };
        }
        return {
            transform: [{ scale: scale.value }, ...translate],
        };
        // switch (platform) {
        //     case 'android':
        //         if (isZooming.value) {
        //             return {
        //                 transform: [
        //                     { translateX: focalX.value },
        //                     { translateY: focalY.value },
        //                     { translateX: -initialWidth.value / openedImageScale.value / 2 },
        //                     { translateY: -initialHeight.value / openedImageScale.value / 2 },
        //                     { scale: scale.value },
        //                     { translateX: -focalX.value },
        //                     { translateY: -focalY.value },
        //                     { translateX: initialWidth.value / openedImageScale.value / 2 },
        //                     { translateY: initialHeight.value / openedImageScale.value / 2 },

        //                     ...translate,
        //                 ],
        //             };
        //         }
        //         return {
        //             transform: [
        //                 { scale: scale.value },
        //                 ...translate,
        //             ],
        //         };
        //     default:
        //         return {
        //             transform: [
        //                 { translateX: focalX.value },
        //                 { translateY: focalY.value },
        //                 { translateX: -initialWidth.value / openedImageScale.value / 2 },
        //                 { translateY: -initialHeight.value / openedImageScale.value / 2 },
        //                 { scale: scale.value },
        //                 { translateX: -focalX.value },
        //                 { translateY: -focalY.value },
        //                 { translateX: initialWidth.value / openedImageScale.value / 2 },
        //                 { translateY: initialHeight.value / openedImageScale.value / 2 },

        //                 ...translate,
        //             ],
        //         };
        // }
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
        <Animated.View>
            <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={onPinchGestureEvent}
                simultaneousHandlers={panRef}
                minPointers={2}
            >
                <Animated.View style={{ flex: 1 }}>
                    <PanGestureHandler
                        ref={panRef}
                        onGestureEvent={onPanGestureEvent}
                        simultaneousHandlers={pinchRef}
                        enableTrackpadTwoFingerGesture={false}
                        maxPointers={1}
                    >
                        <Animated.View style={[animatedStyle]}>{children}</Animated.View>
                    </PanGestureHandler>
                    <Animated.View style={dot} />
                </Animated.View>
            </PinchGestureHandler>
        </Animated.View>
    );
};

// const styles = StyleSheet.create({
//     container: {

//     }
// })
