import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { makeStyles, Portal, useTheme, ColorVariants, Theme } from '@tonlabs/uikit.hydrogen';
import type { DuplicateContentProps } from './types';
import {
    useDuplicateContentState,
    useDimensions,
    useAnimatedContainerStyle,
    useVisibilityState,
    useOnAnimationEnd,
} from './hooks';
import { VisibilityState, DuplicateContentState } from './constants';

export const DuplicateContent = ({
    fullSizeImage,
    previewImage,
    onClose,
    originalRef,
}: DuplicateContentProps) => {
    const theme = useTheme();

    const [isFullSizeDisplayed, setIsFullSizeDisplayed] = React.useState<boolean>(false);

    const { duplicateContentState, onPressUnderlay, onMeasureEnd } = useDuplicateContentState(
        isFullSizeDisplayed,
        setIsFullSizeDisplayed,
    );

    const { pageY, pageX, width, height } = useDimensions(
        originalRef,
        duplicateContentState,
        onMeasureEnd,
    );

    const onAnimationEnd = useOnAnimationEnd(onClose, setIsFullSizeDisplayed);

    const visibilityState = useVisibilityState(duplicateContentState, onAnimationEnd);

    const animatedContainerStyle = useAnimatedContainerStyle(
        visibilityState,
        pageY,
        pageX,
        width,
        height,
    );

    const previewImageStyle = useAnimatedStyle(() => {
        return {
            opacity:
                duplicateContentState.value === DuplicateContentState.Initial ||
                duplicateContentState.value === DuplicateContentState.Measurement ||
                visibilityState.value === VisibilityState.Closed
                    ? 0
                    : 1,
        };
    }, []);

    const overlayStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                visibilityState.value,
                [VisibilityState.Closed, VisibilityState.Opened],
                [0, 1],
            ),
        };
    }, []);

    const styles = useStyles(theme);

    return (
        <Portal absoluteFill>
            <Animated.View style={styles.duplicateContainer}>
                <TouchableWithoutFeedback onPress={onPressUnderlay}>
                    <Animated.View style={[styles.overlay, overlayStyle]} />
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.duplicateContent, animatedContainerStyle]}>
                    <Animated.View style={previewImageStyle}>{previewImage}</Animated.View>
                    {isFullSizeDisplayed ? (
                        <Animated.View style={[styles.fullSizeImage]}>
                            {fullSizeImage}
                        </Animated.View>
                    ) : null}
                </Animated.View>
            </Animated.View>
        </Portal>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    duplicateContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    duplicateContent: {
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
        zIndex: -10,
    },
    fullSizeImage: {
        ...StyleSheet.absoluteFillObject,
    },
}));
