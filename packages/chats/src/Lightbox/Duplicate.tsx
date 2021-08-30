import * as React from 'react';
import { ImageStyle, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';
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
import { UIConstant as UINavigationConstant } from '@tonlabs/uikit.navigation';
import { useBackHandler } from '@react-native-community/hooks';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DuplicateProps } from './types';
import {
    useDuplicateState,
    useDimensions,
    useAnimatedContainerStyle,
    useVisibilityState,
    useOnAnimationEnd,
} from './hooks';
import { VisibilityState, DuplicateState } from './constants';
import { Zoom } from './Zoom';
import { UIConstant } from '../constants';

const DuplicatePortalContent = ({
    fullSizeImage,
    previewImage,
    onClose,
    forwardedRef,
}: DuplicateProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    useStatusBar({
        backgroundColor: ColorVariants.StaticBlack,
    });

    const [isFullSizeDisplayed, setIsFullSizeDisplayed] = React.useState<boolean>(false);

    /**
     * This state is used to create transparency during the "swipeToClose" event
     */
    const underlayOpacity = useSharedValue<number>(VisibilityState.Opened);

    const { duplicateState, onPressClose, onMeasureEnd, onLayout } = useDuplicateState(
        isFullSizeDisplayed,
        setIsFullSizeDisplayed,
    );

    useBackHandler(() => {
        onPressClose();
        return true;
    });

    const { pageY, pageX, width, height } = useDimensions(
        forwardedRef,
        duplicateState,
        onMeasureEnd,
    );

    const onAnimationEnd = useOnAnimationEnd(onClose, setIsFullSizeDisplayed);

    const visibilityState = useVisibilityState(duplicateState, onAnimationEnd);

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
                duplicateState.value === DuplicateState.Initial ||
                duplicateState.value === DuplicateState.Measurement ||
                visibilityState.value === VisibilityState.Closed
                    ? 0
                    : 1,
        };
    }, []);

    const underlayStyle = useAnimatedStyle(() => {
        const resultVisibilityState = underlayOpacity.value * visibilityState.value;
        return {
            opacity: interpolate(
                resultVisibilityState,
                [VisibilityState.Closed, VisibilityState.Opened],
                [0, 1],
            ),
        };
    }, []);

    const headerStyle = useAnimatedStyle(() => {
        const resultVisibilityState = underlayOpacity.value * visibilityState.value;
        return {
            opacity: interpolate(
                resultVisibilityState,
                [VisibilityState.Closed, VisibilityState.Opened],
                [0, 1],
            ),
        };
    }, []);

    const styles = useStyles(theme, insets);

    return (
        <Animated.View style={styles.duplicateContainer}>
            <Animated.View style={[styles.underlay, underlayStyle]} />
            <Animated.View style={[styles.headerContainer, headerStyle]}>
                <Animated.View style={styles.header}>
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
            </Animated.View>
            <Animated.View style={styles.duplicate} pointerEvents="box-none">
                <Zoom
                    contentWidth={contentWidth}
                    contentHeight={contentHeight}
                    onClose={onPressClose}
                    underlayOpacity={underlayOpacity}
                    visibilityState={visibilityState}
                >
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
    );
};

export const Duplicate = (props: DuplicateProps) => {
    return (
        <Portal absoluteFill>
            <DuplicatePortalContent {...props} />
        </Portal>
    );
};

const useStyles = makeStyles((theme: Theme, insets: EdgeInsets) => ({
    duplicateContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    duplicate: {
        ...StyleSheet.absoluteFillObject,
    },
    zoomContent: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    underlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -10,
        backgroundColor: theme[ColorVariants.StaticBlack],
    },
    fullSizeImage: {
        ...StyleSheet.absoluteFillObject,
    },
    headerContainer: {
        paddingTop: insets.top,
        zIndex: 10,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
    },
    header: {
        minHeight: UINavigationConstant.headerHeight,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: UIConstant.lightbox.verticalHeaderPadding,
        paddingHorizontal: UINavigationConstant.contentOffset,
    },
    backButton: {
        width: UICoreConstant.iconSize(),
        height: UICoreConstant.iconSize(),
    },
}));
