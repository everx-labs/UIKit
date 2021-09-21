import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import type { StyleProp, ViewProps } from 'react-native';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIConstant } from '../constants';

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: UIConstant.alertBorderRadius,
    },
});

type Props = Omit<ViewProps, 'style'> & {
    /**
     * Elements to be rendered on the BlurView
     */
    children?: React.ReactNode;
    /**
     * Style of the BlurView
     */
    style?: StyleProp<ViewStyle>;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

function isBlurSupported() {
    return (
        typeof CSS !== 'undefined' &&
        (CSS.supports('-webkit-backdrop-filter', 'blur(1px)') ||
            CSS.supports('backdrop-filter', 'blur(1px)'))
    );
}

function getBlurStyle(color: string): Record<string, string> {
    const style: Record<string, string> = {
        backgroundColor: color,
    };

    if (isBlurSupported()) {
        style.backdropFilter = `blur(${80 * 0.2}px)`;
    }

    return style;
}

export const UIBlurView = React.forwardRef<View, Props>(function UIBlurViewForwarded(
    { style, testID, ...rest }: Props,
    ref,
) {
    const color = useTheme()[ColorVariants.BackgroundOverlayInverted] as string;
    const blurStyle = getBlurStyle(color);

    return (
        <View ref={ref} testID={testID} {...rest} style={[styles.container, style, blurStyle]} />
    );
});
