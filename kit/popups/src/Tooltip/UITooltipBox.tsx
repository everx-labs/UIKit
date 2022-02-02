import * as React from 'react';
import {
    LayoutChangeEvent,
    ScaledSize,
    StyleSheet,
    useWindowDimensions,
    PixelRatio,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ColorVariants, useTheme, Theme, makeStyles, useColorParts } from '@tonlabs/uikit.themes';
import { UILayoutConstant, Portal } from '@tonlabs/uikit.layout';
import type { UITooltipBoxProps } from './types';
import { UIConstant } from '../constants';
import { ShadowView } from '../ShadowView';
import { TargetDimensions, useTargetDimensions } from '../useTargetDimensions';
import { usePopupLayoutAnimationFunctions } from '../usePopupLayoutAnimationFunctions';
import { UITooltipContent } from './UITooltipContent';
import { UITooltipBackdrop } from './UITooltipBackdrop';

type Location = {
    left: number;
    top: number | undefined;
    bottom: number | undefined;
};
type Size = {
    width: number;
    height: number;
};
const initialSize: Size = {
    width: 0,
    height: 0,
};

function getBoundaries(windowDimensions: ScaledSize, tooltipSize: Size) {
    return {
        right: windowDimensions.width - UILayoutConstant.contentOffset - tooltipSize.width,
        bottom: windowDimensions.height - UILayoutConstant.contentOffset - tooltipSize.height,
        left: UILayoutConstant.contentOffset,
    };
}

function useTooltipLocation(
    targetDimensions: TargetDimensions | null,
    windowDimensions: ScaledSize,
    tooltipSize: Size,
): Location | null {
    return React.useMemo(() => {
        if (!tooltipSize.height || !tooltipSize.width || !targetDimensions) {
            return null;
        }

        const horizontalOffsetToCenterTooltip = (targetDimensions.width - tooltipSize.width) / 2;

        const boundaries = getBoundaries(windowDimensions, tooltipSize);

        let top: number | undefined = targetDimensions.y + targetDimensions.height;
        let bottom: number | undefined;
        const left: number = Math.max(
            boundaries.left,
            Math.min(boundaries.right, targetDimensions.x + horizontalOffsetToCenterTooltip),
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
    }, [targetDimensions, windowDimensions, tooltipSize]);
}

function useTooltipMeasuring() {
    const [tooltipSize, setTooltipSize] = React.useState<Size>(initialSize);
    const onLayout = React.useCallback(
        function onLayout(event: LayoutChangeEvent) {
            const width = Math.round(event.nativeEvent.layout.width);
            const height = Math.round(event.nativeEvent.layout.height);
            if (tooltipSize.width !== width || tooltipSize.height !== height) {
                setTooltipSize({ width, height });
            }
        },
        [tooltipSize],
    );
    return { tooltipSize, onLayout };
}

export function UITooltipBox({ message, triggerRef, onClose, forId, testID }: UITooltipBoxProps) {
    const contentRef = React.useRef<View>(null);
    const theme = useTheme();
    const { entering, exiting } = usePopupLayoutAnimationFunctions();
    const windowDimensions = useWindowDimensions();
    const triggerDimensions = useTargetDimensions(triggerRef, windowDimensions);

    const { tooltipSize, onLayout } = useTooltipMeasuring();

    const tooltipLocation = useTooltipLocation(triggerDimensions, windowDimensions, tooltipSize);

    const { color: shadowColor, opacity: shadowOpacity } = useColorParts(
        ColorVariants.BackgroundOverlay,
    );

    const styles = useStyles(theme, tooltipLocation, shadowColor, shadowOpacity);

    if (!tooltipLocation) {
        return (
            <View style={styles.measureContainer}>
                <UITooltipContent onLayout={onLayout}>{message}</UITooltipContent>
            </View>
        );
    }

    return (
        <Portal absoluteFill forId={forId}>
            <UITooltipBackdrop onTap={onClose} triggerRef={triggerRef} contentRef={contentRef} />
            <Animated.View
                style={styles.container}
                entering={entering}
                exiting={exiting}
                testID={testID}
            >
                <ShadowView style={styles.shadowContainer}>
                    <UITooltipContent onLayout={onLayout} ref={contentRef}>
                        {message}
                    </UITooltipContent>
                </ShadowView>
            </Animated.View>
        </Portal>
    );
}

const useStyles = makeStyles(
    (
        theme: Theme,
        tooltipLocation: Location | null,
        shadowColor: string,
        shadowOpacity: number,
    ) => ({
        measureContainer: {
            position: 'absolute',
            width: UIConstant.tooltip.maxWidth,
            alignItems: 'flex-start',
            opacity: 0,
        },
        container: {
            position: 'absolute',
            ...tooltipLocation,
        },
        shadowContainer: {
            backgroundColor: theme[ColorVariants.BackgroundBW],
            borderRadius: UIConstant.tooltip.borderRadius,
            shadowRadius: 24 / PixelRatio.get(),
            shadowOffset: {
                width: 0,
                height: 16 / PixelRatio.get(),
            },
            shadowColor,
            shadowOpacity,
        },
        underlay: {
            ...StyleSheet.absoluteFillObject,
        },
    }),
);
