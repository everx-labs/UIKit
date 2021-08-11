import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { makeStyles, Portal } from '@tonlabs/uikit.hydrogen';
import type { DuplicateProps } from './types';
import {
    useVisibilityState,
    useDimensions,
    useScaleStyle,
} from './hooks/duplicateContentHooks';

export const DuplicateContent = ({
    children,
    onClose,
    originalRef,
}: DuplicateProps) => {
    const { visibilityState, onPressUnderlay } = useVisibilityState();

    const { pageY, pageX, width, height } = useDimensions(
        originalRef,
        visibilityState,
    );

    const duplicateContainerDimensionsStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: pageY.value,
                },
                {
                    translateX: pageX.value,
                },
            ],
            width: width.value,
            height: height.value,
        };
    });

    const { scaleStyle } = useScaleStyle(visibilityState, onClose);

    const styles = useStyles();

    return (
        <Portal absoluteFill>
            <Animated.View style={styles.duplicateContainer}>
                <TouchableWithoutFeedback onPress={onPressUnderlay}>
                    <Animated.View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        styles.duplicateContent,
                        duplicateContainerDimensionsStyle,
                    ]}
                >
                    <Animated.View style={[scaleStyle]}>
                        {children}
                    </Animated.View>
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
