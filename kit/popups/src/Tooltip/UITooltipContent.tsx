import * as React from 'react';
import {
    LayoutChangeEvent,
    ScaledSize,
    StyleSheet,
    useWindowDimensions,
    PixelRatio,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import {
    ColorVariants,
    useTheme,
    Theme,
    makeStyles,
    useColorParts,
    UILabel,
    TypographyVariants,
    UILabelColors,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant, Portal } from '@tonlabs/uikit.layout';
import type { UITooltipContentProps } from './types';
import { UIConstant } from '../constants';
import { ShadowView } from '../ShadowView';
import { TargetDimensions, useTargetDimensions } from '../useTargetDimensions';

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

export function UITooltipContent({
    message,
    targetRef,
    onClose: onCloseProp,
    forId,
    testID,
}: UITooltipContentProps) {
    const theme = useTheme();
    const windowDimensions = useWindowDimensions();
    const targetDimensions = useTargetDimensions(targetRef, windowDimensions);

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
    const tooltipLocation = useTooltipLocation(targetDimensions, windowDimensions, tooltipSize);

    const onClose = React.useCallback(
        function onClose() {
            onCloseProp();
        },
        [onCloseProp],
    );

    const { color: shadowColor, opacity: shadowOpacity } = useColorParts(
        ColorVariants.BackgroundOverlay,
    );
    const styles = useStyles(theme, tooltipLocation, shadowColor, shadowOpacity);

    return (
        <Portal absoluteFill forId={forId}>
            <TapGestureHandler onEnded={onClose}>
                <View style={StyleSheet.absoluteFill} />
            </TapGestureHandler>
            <Animated.View
                style={styles.container}
                entering={FadeIn.duration(UIConstant.tooltip.animationTime)}
                exiting={FadeOut.duration(UIConstant.tooltip.animationTime)}
                onLayout={onLayout}
                testID={testID}
            >
                <ShadowView style={styles.shadowContainer}>
                    <UILabel
                        role={TypographyVariants.NarrowParagraphFootnote}
                        color={UILabelColors.TextPrimary}
                    >
                        {message}
                    </UILabel>
                </ShadowView>
            </Animated.View>
        </Portal>
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
            backgroundColor: theme[ColorVariants.BackgroundBW],
            borderRadius: UIConstant.tooltip.borderRadius,
            maxWidth: UIConstant.tooltip.maxWidth,
            padding: UILayoutConstant.smallContentOffset,
            shadowRadius: 24 / PixelRatio.get(),
            shadowOffset: {
                width: 0,
                height: 16 / PixelRatio.get(),
            },
            shadowColor,
            shadowOpacity,
        },
    }),
);
