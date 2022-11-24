import * as React from 'react';
import {
    I18nManager,
    LayoutChangeEvent,
    ScaledSize,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { ColorVariants, useTheme, Theme, makeStyles, useShadow } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import clamp from 'lodash/clamp';
import type { UIMenuContainerContentProps } from './types';
import { UIConstant } from '../constants';
import { ShadowView } from '../ShadowView';
import { useTargetDimensions, TargetDimensions } from '../useTargetDimensions';
// import { usePopupLayoutAnimationFunctions } from '../usePopupLayoutAnimationFunctions';

type Location = {
    top: number;
    left?: number;
    right?: number;
};
type Size = {
    width: number;
    height: number;
};

const initialSize: Size = {
    width: 0,
    height: 0,
};
const initialPosition: Location = {
    top: -10000,
    left: -10000,
};

function getBoundaries(windowDimensions: ScaledSize, menuSize: Size) {
    return {
        right: windowDimensions.width - UILayoutConstant.contentOffset - menuSize.width,
        bottom: windowDimensions.height - UILayoutConstant.contentOffset - menuSize.height,
        left: UILayoutConstant.contentOffset,
    };
}

function useMenuLocation(
    triggerDimensions: TargetDimensions | null,
    windowDimensions: ScaledSize,
    menuSize: Size,
): Location {
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);
    return React.useMemo(() => {
        if (!menuSize.height || !menuSize.width || !triggerDimensions) {
            return initialPosition;
        }

        const boundaries = getBoundaries(windowDimensions, menuSize);

        let top: number | undefined = triggerDimensions.y + triggerDimensions.height;
        const left: number = clamp(
            isRTL
                ? triggerDimensions.x - menuSize.width + triggerDimensions.width
                : triggerDimensions.x,
            boundaries.left,
            boundaries.right,
        );

        if (top > boundaries.bottom) {
            top = triggerDimensions.y - menuSize.height;
        }

        if (isRTL) {
            return {
                top,
                right: left,
            };
        }
        return { top, left };
    }, [menuSize, triggerDimensions, windowDimensions, isRTL]);
}

export function UIMenuContainerContent({
    children,
    triggerRef,
    onClose,
    testID,
}: UIMenuContainerContentProps) {
    const theme = useTheme();
    // const { entering, exiting } = usePopupLayoutAnimationFunctions();
    const windowDimensions = useWindowDimensions();
    const triggerDimensions = useTargetDimensions(triggerRef, windowDimensions);

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
    const menuLocation = useMenuLocation(triggerDimensions, windowDimensions, menuSize);

    const shadow = useShadow(5);
    const styles = useStyles(theme, shadow);

    return (
        <>
            <TapGestureHandler onHandlerStateChange={onClose}>
                <View style={StyleSheet.absoluteFill} />
            </TapGestureHandler>
            <Animated.View
                style={[styles.container, menuLocation]}
                // entering={entering}
                // exiting={exiting}
                onLayout={onLayout}
                testID={testID}
            >
                <ShadowView style={styles.shadowContainer}>
                    <View style={styles.shadowContent}>{children}</View>
                </ShadowView>
            </Animated.View>
        </>
    );
}

const useStyles = makeStyles((theme: Theme, shadow: any) => ({
    container: {
        position: 'absolute',
    },
    shadowContainer: {
        ...shadow,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderRadius: UILayoutConstant.alertBorderRadius,
    },
    shadowContent: {
        borderRadius: UILayoutConstant.alertBorderRadius,
        width: UIConstant.menu.width,
        paddingHorizontal: UILayoutConstant.contentOffset,
        overflow: 'hidden',
        alignItems: 'stretch',
    },
}));
