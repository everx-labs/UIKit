import * as React from 'react';
import {
    LayoutChangeEvent,
    NativeMethods,
    ScaledSize,
    StyleSheet,
    useWindowDimensions,
    PixelRatio,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { ColorVariants, useTheme, Theme, makeStyles, useColorParts } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIMenuContainerContentProps } from './types';
import { UIConstant } from '../constants';
import { ShadowView } from '../ShadowView';

type Location = {
    left: number;
    top: number | undefined;
    bottom: number | undefined;
};
type Size = {
    width: number;
    height: number;
};
type Dimensions = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const initialSize: Size = {
    width: 0,
    height: 0,
};

function useTargetDimensions(
    targetRef: React.RefObject<NativeMethods>,
    windowDimensions: ScaledSize,
): Dimensions | null {
    const [dimensions, setDimensions] = React.useState<Dimensions | null>(null);

    React.useEffect(() => {
        targetRef.current?.measure(
            (
                _x: number,
                _y: number,
                width: number,
                height: number,
                pageX: number,
                pageY: number,
            ) => {
                setDimensions({
                    x: pageX,
                    y: pageY,
                    width,
                    height,
                });
            },
        );
    }, [targetRef, windowDimensions]);

    return dimensions;
}

function getBoundaries(windowDimensions: ScaledSize, menuSize: Size) {
    return {
        right: windowDimensions.width - UILayoutConstant.contentOffset - menuSize.width,
        bottom: windowDimensions.height - UILayoutConstant.contentOffset - menuSize.height,
        left: UILayoutConstant.contentOffset,
    };
}

function useMenuLocation(
    targetDimensions: Dimensions | null,
    windowDimensions: ScaledSize,
    menuSize: Size,
): Location | null {
    return React.useMemo(() => {
        if (!menuSize.height || !menuSize.width || !targetDimensions) {
            return null;
        }

        const boundaries = getBoundaries(windowDimensions, menuSize);

        let top: number | undefined = targetDimensions.y + targetDimensions.height;
        let bottom: number | undefined;
        const left: number = Math.max(
            boundaries.left,
            Math.min(boundaries.right, targetDimensions.x),
        );

        if (top > boundaries.bottom) {
            top = undefined;
            bottom = windowDimensions.height - targetDimensions.y;
        }

        return {
            left,
            top,
            bottom,
        };
    }, [targetDimensions, windowDimensions, menuSize]);
}

export function UIMenuContainerContent({
    children,
    targetRef,
    onClose: onCloseProp,
    testID,
}: UIMenuContainerContentProps) {
    const theme = useTheme();
    const windowDimensions = useWindowDimensions();
    const targetDimensions = useTargetDimensions(targetRef, windowDimensions);

    const [menuSize, setMenuSize] = React.useState<Size>(initialSize);
    const onLayout = React.useCallback(
        function onLayout(event: LayoutChangeEvent) {
            const width = Math.round(event.nativeEvent.layout.width);
            const height = Math.round(event.nativeEvent.layout.height);
            if (menuSize.width !== width || menuSize.height !== height) {
                setMenuSize({ width, height });
            }
        },
        [menuSize],
    );
    const menuLocation = useMenuLocation(targetDimensions, windowDimensions, menuSize);

    const onClose = React.useCallback(
        function onClose() {
            onCloseProp();
        },
        [onCloseProp],
    );

    const { color: shadowColor, opacity: shadowOpacity } = useColorParts(
        ColorVariants.BackgroundOverlay,
    );
    const styles = useStyles(theme, menuLocation, shadowColor, shadowOpacity);

    return (
        <>
            <TapGestureHandler onEnded={onClose}>
                <View style={StyleSheet.absoluteFill} />
            </TapGestureHandler>
            <Animated.View
                style={styles.container}
                entering={FadeIn.duration(UIConstant.menu.animationTime)}
                exiting={FadeOut.duration(UIConstant.menu.animationTime)}
                onLayout={onLayout}
                testID={testID}
            >
                <ShadowView style={styles.shadowContainer}>{children}</ShadowView>
            </Animated.View>
        </>
    );
}

const useStyles = makeStyles(
    (theme: Theme, location: Location | null, shadowColor: string, shadowOpacity: number) => ({
        container: {
            position: 'absolute',
            top: -10000,
            left: -10000,
            ...location,
        },
        shadowContainer: {
            backgroundColor: theme[ColorVariants.BackgroundPrimary],
            borderRadius: UILayoutConstant.alertBorderRadius,
            width: UIConstant.menu.width,
            paddingHorizontal: UILayoutConstant.contentOffset,
            shadowRadius: 48 / PixelRatio.get(),
            shadowOffset: {
                width: 0,
                height: 32 / PixelRatio.get(),
            },
            shadowColor,
            shadowOpacity,
        },
    }),
);
