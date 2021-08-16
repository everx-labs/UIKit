import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { makeStyles, Portal } from '@tonlabs/uikit.hydrogen';
import type { DuplicateContentProps } from './types';
import {
    useDuplicateContentState,
    useDimensions,
    useAnimatedContainerStyle,
    useVisibilityState,
} from './hooks';
import { VisibilityState, DuplicateContentState } from './constants';

export const DuplicateContent = ({
    fullSizeImage,
    previewImage,
    onClose,
    originalRef,
}: DuplicateContentProps) => {
    const [isFullSizeDisplayed, setIsFullSizeDisplayed] = React.useState<boolean>(false);
    const { duplicateContentState, onPressUnderlay } = useDuplicateContentState(
        isFullSizeDisplayed,
        setIsFullSizeDisplayed,
    );

    const { pageY, pageX, width, height } = useDimensions(originalRef, duplicateContentState);

    const fullSizeImageState = useSharedValue<VisibilityState>(VisibilityState.Closed);

    const onAnimationEnd = React.useCallback(
        (state: VisibilityState) => {
            if (state === VisibilityState.Closed) {
                onClose();
            }
            if (state === VisibilityState.Opened) {
                setTimeout(() => {
                    console.log('Opened');
                    setIsFullSizeDisplayed(true);
                }, 20);
            }
        },
        [onClose],
    );

    const visibilityState = useVisibilityState(
        duplicateContentState,
        onAnimationEnd,
        fullSizeImageState,
    );

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
    fullSizeImage: {
        ...StyleSheet.absoluteFillObject,
    },
}));
