import * as React from 'react';
import {
    ImageStyle,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import {
    makeStyles,
    Portal,
    useTheme,
    ColorVariants,
    Theme,
    useStatusBar,
    UIImage,
} from '@tonlabs/uikit.hydrogen';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant as UICoreConstant } from '@tonlabs/uikit.core';
import { useBackHandler } from '@react-native-community/hooks';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { UIConstant } from '../constants';

export const DuplicateContent = ({
    fullSizeImage,
    previewImage,
    onClose,
    originalRef,
}: DuplicateContentProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    useStatusBar({
        backgroundColor: ColorVariants.StaticBackgroundBlack,
    });

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

    const underlayStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                visibilityState.value,
                [VisibilityState.Closed, VisibilityState.Opened],
                [0, 1],
            ),
        };
    }, []);

    const headerStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                visibilityState.value,
                [VisibilityState.Closed, VisibilityState.Opened],
                [0, 1],
            ),
        };
    }, []);

    const styles = useStyles(theme, insets);

    return (
        <Portal absoluteFill>
            <Animated.View style={styles.duplicateContainer}>
                <TouchableWithoutFeedback onPress={onPressClose}>
                    <Animated.View style={[styles.underlay, underlayStyle]} />
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.header, headerStyle]}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onPressClose}
                        hitSlop={UIConstant.lightbox.hitSlop}
                    >
                        <UIImage
                            source={UIAssets.icons.ui.arrowLeftBlack}
                            style={styles.backButton as ImageStyle}
                            tintColor={ColorVariants.StaticIconPrimaryLight}
                        />
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={styles.duplicateContent} pointerEvents="box-none">
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

const useStyles = makeStyles((theme: Theme, insets: EdgeInsets) => ({
    duplicateContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    duplicateContent: {
        ...StyleSheet.absoluteFillObject,
    },
    zoomContent: {
        ...StyleSheet.absoluteFillObject,
    },
    underlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -10,
        backgroundColor: theme[ColorVariants.StaticBackgroundBlack],
    },
    fullSizeImage: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        zIndex: 10,
        minHeight: UIConstant.lightbox.headerMinHeight,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: insets.top,
        paddingVertical: UIConstant.lightbox.verticalHeaderPadding,
        paddingHorizontal: UIConstant.contentOffset,
    },
    backButton: {
        width: UICoreConstant.iconSize(),
        height: UICoreConstant.iconSize(),
    },
}));
