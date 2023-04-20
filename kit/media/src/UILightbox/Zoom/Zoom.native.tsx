import * as React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedRef, useSharedValue } from 'react-native-reanimated';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import type { ZoomProps } from '../types';
import {
    useOnMove,
    useOnZoom,
    useReactionOnVisibilityStateChange,
    useUnderlayOpacityTransitions,
    useZoomStyle,
} from '../hooks/zoomHooks';

const INITIAL_VALUE = -1;

export function Zoom({
    children,
    contentWidth,
    contentHeight,
    onClose,
    underlayOpacity,
    visibilityState,
}: ZoomProps) {
    const pinchRef = useAnimatedRef();
    const panRef = useAnimatedRef();

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    /**
     * Last scale
     */
    const baseScale = useSharedValue<number>(1);
    /**
     * Scale of current pinch
     */
    const scale = useSharedValue<number>(1);
    /**
     * Is pinch gesture active
     */
    const isZooming = useSharedValue<boolean>(false);
    /**
     * Is pan gesture active
     */
    const isMoving = useSharedValue<boolean>(false);
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

    useUnderlayOpacityTransitions(translationY, baseScale, underlayOpacity, windowHeight, isMoving);

    useReactionOnVisibilityStateChange(visibilityState, baseScale, translationX, translationY);

    const onZoom = useOnZoom(
        isZooming,
        isMoving,
        focalX,
        focalY,
        scale,
        INITIAL_VALUE,
        windowWidth,
        windowHeight,
        baseScale,
        translationX,
        translationY,
        contentWidth,
        contentHeight,
    );

    const onMove = useOnMove(
        windowWidth,
        windowHeight,
        baseScale,
        translationX,
        translationY,
        contentWidth,
        contentHeight,
        onClose,
        isZooming,
        isMoving,
    );

    const animatedStyle = useZoomStyle(
        isZooming,
        focalX,
        focalY,
        scale,
        windowWidth,
        windowHeight,
        baseScale,
        translationX,
        translationY,
    );

    return (
        <Animated.View style={styles.fullScreen}>
            <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={onZoom}
                simultaneousHandlers={panRef}
            >
                <Animated.View style={styles.fullScreen}>
                    <PanGestureHandler
                        ref={panRef}
                        onGestureEvent={onMove}
                        simultaneousHandlers={pinchRef}
                        enableTrackpadTwoFingerGesture={false}
                        maxPointers={1}
                    >
                        <Animated.View style={styles.fullScreen}>
                            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                                {children}
                            </Animated.View>
                        </Animated.View>
                    </PanGestureHandler>
                </Animated.View>
            </PinchGestureHandler>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
});
