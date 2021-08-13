import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { makeStyles, Portal } from '@tonlabs/uikit.hydrogen';
import type { DuplicateProps } from './types';
import {
    useVisibilityState,
    useDimensions,
    useAnimatedContainerStyle,
    useAnimationProgress,
} from './hooks';
import { VisibilityState } from './constants';

export const DuplicateContent = ({ children, onClose, originalRef }: DuplicateProps) => {
    const { visibilityState, onPressUnderlay } = useVisibilityState();

    const { pageY, pageX, width, height } = useDimensions(originalRef, visibilityState);

    const animationProgress = useAnimationProgress(visibilityState, onClose);

    const animatedContainerStyle = useAnimatedContainerStyle(
        animationProgress,
        pageY,
        pageX,
        width,
        height,
    );

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: visibilityState.value === VisibilityState.Measurement ? 0 : 1,
        };
    });

    const styles = useStyles();

    return (
        <Portal absoluteFill>
            <Animated.View style={styles.duplicateContainer}>
                <TouchableWithoutFeedback onPress={onPressUnderlay}>
                    <Animated.View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.duplicateContent, animatedContainerStyle]}>
                    <Animated.View style={opacityStyle}>{children}</Animated.View>
                </Animated.View>
            </Animated.View>
        </Portal>
    );
};

const useStyles = makeStyles(() => ({
    duplicateContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    duplicateContent: {
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#00000099',
        zIndex: -10,
    },
}));
