import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { makeStyles, Portal } from '@tonlabs/uikit.hydrogen';
import type { DuplicateProps } from './types';
import {
    useDuplicateContentState,
    useDimensions,
    useAnimatedContainerStyle,
    useVisibilityState,
} from './hooks';
import { VisibilityState, DuplicateContentState } from './constants';

export const DuplicateContent = ({ previewImage, onClose, originalRef }: DuplicateProps) => {
    const { duplicateContentState, onPressUnderlay } = useDuplicateContentState();

    const { pageY, pageX, width, height } = useDimensions(originalRef, duplicateContentState);

    // const [isFullSizeDisplayed, setIsFullSizeDisplayed] = React.useState<boolean>(false);

    const onAnimationEnd = React.useCallback(
        (visibilityState: VisibilityState) => {
            if (visibilityState === VisibilityState.Closed) {
                onClose();
            }
        },
        [onClose],
    );

    const visibilityState = useVisibilityState(duplicateContentState, onAnimationEnd);

    const animatedContainerStyle = useAnimatedContainerStyle(
        visibilityState,
        pageY,
        pageX,
        width,
        height,
    );

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: duplicateContentState.value === DuplicateContentState.Measurement ? 0 : 1,
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
                    <Animated.View style={opacityStyle}>{previewImage}</Animated.View>
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
