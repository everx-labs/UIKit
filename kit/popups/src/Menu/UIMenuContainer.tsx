import * as React from 'react';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { ColorVariants, useTheme, Theme, makeStyles } from '@tonlabs/uikit.themes';
import { Portal, UILayoutConstant } from '@tonlabs/uikit.layout';
import {
    LayoutChangeEvent,
    NativeMethods,
    ScaledSize,
    StyleSheet,
    useWindowDimensions,
    TouchableOpacity,
} from 'react-native';
import type { UIMenuContainerProps } from './types';
import { UIConstant } from '../constants';

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

const initialDimensions: Dimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};
const initialSize: Size = {
    width: 0,
    height: 0,
};

function useTargetDimensions(
    visible: boolean,
    targetRef: React.RefObject<NativeMethods>,
): Dimensions {
    const [dimensions, setDimensions] = React.useState<Dimensions>(initialDimensions);

    React.useEffect(() => {
        if (visible) {
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
        }
    }, [targetRef, visible]);

    return dimensions;
}

function getBoundaries(windowDimensions: ScaledSize, menuSize: Size) {
    return {
        top: UILayoutConstant.contentOffset,
        right: windowDimensions.width - UILayoutConstant.contentOffset - menuSize.width,
        bottom: windowDimensions.height - UILayoutConstant.contentOffset - menuSize.height,
        left: UILayoutConstant.contentOffset,
    };
}

function useMenuLocation(
    targetDimensions: Dimensions,
    windowDimensions: ScaledSize,
    menuSize: Size,
): Location | null {
    return React.useMemo(() => {
        const { x: targetX, y: targetY, height: targetHeight } = targetDimensions;

        if (!menuSize.height || !menuSize.width) {
            return null;
        }

        let top: number | undefined = targetY + targetHeight;
        let bottom: number | undefined;
        let left: number | undefined = targetX;

        const boundaries = getBoundaries(windowDimensions, menuSize);

        if (left > boundaries.right) {
            left = boundaries.right;
        }
        if (left < boundaries.left) {
            left = boundaries.left;
        }

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

export function UIMenuContainer({ children, visible, targetRef, onClose }: UIMenuContainerProps) {
    // const measuredRef = React.useRef(false);
    const theme = useTheme();
    const windowDimensions = useWindowDimensions();
    const targetDimensions = useTargetDimensions(visible, targetRef);

    const [menuSize, setMenuSize] = React.useState<Size>(initialSize);
    const onLayout = React.useCallback(
        function onLayout(event: LayoutChangeEvent) {
            // if (!measuredRef.current) {
            //     measuredRef.current = true;
            // }
            const { width, height } = event.nativeEvent.layout;
            if (width !== menuSize.width || height !== menuSize.height) {
                setMenuSize({ width, height });
            }
        },
        [menuSize],
    );
    const menuLocation = useMenuLocation(targetDimensions, windowDimensions, menuSize);
    const styles = useStyles(theme, menuLocation);

    const onPressIn = React.useCallback(
        function onPressIn() {
            onClose();
        },
        [onClose],
    );

    if (!visible) {
        return null;
    }

    return (
        <Portal absoluteFill>
            {/* <TapGestureHandler
                onBegan={() => console.log('onBegan')}
            >
                <View style={StyleSheet.absoluteFill} />
            </TapGestureHandler> */}
            <TouchableOpacity onPressIn={onPressIn} style={StyleSheet.absoluteFill} />
            {/* <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} /> */}

            <Animated.View
                style={[styles.container]}
                entering={FadeInUp}
                exiting={FadeOutDown}
                onLayout={onLayout}
            >
                {children}
            </Animated.View>
        </Portal>
    );
}

const useStyles = makeStyles((theme: Theme, location: Location | null) => ({
    container: {
        position: 'absolute',
        ...location,
        opacity: location ? 1 : 0,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderRadius: UILayoutConstant.alertBorderRadius,
        overflow: 'hidden',
        width: UIConstant.menuWidth,
    },
}));
