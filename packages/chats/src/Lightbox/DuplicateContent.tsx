import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import {
    makeStyles,
    Portal,
    useTheme,
    ColorVariants,
    Theme,
    UIBoxButton,
} from '@tonlabs/uikit.hydrogen';
import { useBackHandler } from '@react-native-community/hooks';
import type { DuplicateContentProps } from './types';
import {
    useDuplicateContentState,
    useDimensions,
    useAnimatedContainerStyle,
    useVisibilityState,
    useOnAnimationEnd,
} from './hooks';
import { VisibilityState, DuplicateContentState } from './constants';
import { Zoom } from './Zoom';

export const DuplicateContent = ({
    fullSizeImage,
    previewImage,
    onClose,
    originalRef,
}: DuplicateContentProps) => {
    const theme = useTheme();

    const [isFullSizeDisplayed, setIsFullSizeDisplayed] = React.useState<boolean>(false);

    const {
        duplicateContentState,
        onPressClose,
        onMeasureEnd,
        onLayout,
    } = useDuplicateContentState(isFullSizeDisplayed, setIsFullSizeDisplayed);

    useBackHandler(() => {
        onPressClose();
        return true;
    });

    const { pageY, pageX, width, height } = useDimensions(
        originalRef,
        duplicateContentState,
        onMeasureEnd,
    );

    const onAnimationEnd = useOnAnimationEnd(onClose, setIsFullSizeDisplayed);

    const visibilityState = useVisibilityState(duplicateContentState, onAnimationEnd);

    const { animatedContainerStyle, openedImageScale } = useAnimatedContainerStyle(
        visibilityState,
        pageY,
        pageX,
        width,
        height,
    );

    const contentWidth = useDerivedValue(() => {
        return width.value * openedImageScale.value;
    });
    const contentHeight = useDerivedValue(() => {
        return height.value * openedImageScale.value;
    });

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
                <TouchableWithoutFeedback onPress={onPressClose}>
                    <Animated.View style={[styles.overlay, overlayStyle]} />
                </TouchableWithoutFeedback>
                <View
                    style={{
                        zIndex: 10,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        paddingTop: 30,
                    }}
                >
                    <UIBoxButton title="Close" onPress={onPressClose} />
                </View>
                <Animated.View style={[styles.duplicateContent]} pointerEvents="box-none">
                    <Zoom contentWidth={contentWidth} contentHeight={contentHeight}>
                        <Animated.View
                            style={[styles.zoomContent, animatedContainerStyle]}
                            pointerEvents="box-none"
                        >
                            <Animated.View style={previewImageStyle}>
                                <View onLayout={onLayout}>{previewImage}</View>
                            </Animated.View>
                            {isFullSizeDisplayed ? (
                                <Animated.View style={styles.fullSizeImage}>
                                    {fullSizeImage}
                                </Animated.View>
                            ) : null}
                        </Animated.View>
                    </Zoom>
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
        ...StyleSheet.absoluteFillObject,
    },
    zoomContent: {
        ...StyleSheet.absoluteFillObject,
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
