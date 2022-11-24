import * as React from 'react';
import { I18nManager, LayoutChangeEvent, ScaledSize, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import clamp from 'lodash/clamp';
import { ColorVariants, useTheme, Theme, makeStyles, useShadow } from '@tonlabs/uikit.themes';
import { UILayoutConstant, Portal } from '@tonlabs/uikit.layout';
import type { UITooltipBoxProps } from './types';
import { UIConstant } from '../constants';
import { ShadowView } from '../ShadowView';
import { TargetDimensions, useTargetDimensions } from '../useTargetDimensions';
// import { usePopupLayoutAnimationFunctions } from '../usePopupLayoutAnimationFunctions';
import { UITooltipContent } from './UITooltipContent';
import { UITooltipBackdrop } from './UITooltipBackdrop';
import { useWindowDimensions } from '../useWindowDimensions';

type Location = {
    top?: number;
    bottom?: number;
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

function getBoundaries(windowDimensions: ScaledSize, tooltipSize: Size) {
    return {
        right: windowDimensions.width - UILayoutConstant.contentOffset - tooltipSize.width,
        bottom: windowDimensions.height - UILayoutConstant.contentOffset - tooltipSize.height,
        left: UILayoutConstant.contentOffset,
    };
}

function useTooltipLocation(
    triggerDimensions: TargetDimensions | null,
    windowDimensions: ScaledSize,
    tooltipSize: Size,
): Location | null {
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);
    return React.useMemo(() => {
        if (!tooltipSize.height || !tooltipSize.width || !triggerDimensions) {
            return null;
        }

        const horizontalOffsetToCenterTooltip = (triggerDimensions.width - tooltipSize.width) / 2;

        const boundaries = getBoundaries(windowDimensions, tooltipSize);

        let top: number | undefined = triggerDimensions.y + triggerDimensions.height;
        let bottom: number | undefined;
        const left: number = clamp(
            triggerDimensions.x + horizontalOffsetToCenterTooltip,
            boundaries.left,
            boundaries.right,
        );

        if (top > boundaries.bottom) {
            top = undefined;
            bottom = windowDimensions.height - triggerDimensions.y;
        }

        if (isRTL) {
            return {
                top,
                right: left,
                bottom,
            };
        }
        return { top, left, bottom };
    }, [tooltipSize, triggerDimensions, windowDimensions, isRTL]);
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
    // const { entering, exiting } = usePopupLayoutAnimationFunctions();
    const windowDimensions = useWindowDimensions();
    const triggerDimensions = useTargetDimensions(triggerRef, windowDimensions);

    const { tooltipSize, onLayout } = useTooltipMeasuring();

    const tooltipLocation = useTooltipLocation(triggerDimensions, windowDimensions, tooltipSize);

    const shadow = useShadow(4);
    const styles = useStyles(theme, shadow);

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
                style={[styles.container, tooltipLocation]}
                // entering={entering}
                // exiting={exiting}
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

const useStyles = makeStyles((theme: Theme, shadow: any) => ({
    measureContainer: {
        position: 'absolute',
        width: UIConstant.tooltip.maxWidth,
        alignItems: 'flex-start',
        opacity: 0,
    },
    container: {
        position: 'absolute',
    },
    shadowContainer: {
        backgroundColor: theme[ColorVariants.BackgroundBW],
        borderRadius: UIConstant.tooltip.borderRadius,
        ...shadow,
    },
    underlay: {
        ...StyleSheet.absoluteFillObject,
    },
}));
