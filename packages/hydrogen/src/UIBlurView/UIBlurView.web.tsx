import * as React from 'react';
import { View, ViewStyle} from 'react-native';
import type { StyleProp, ViewProps } from 'react-native';
import { ColorVariants, useTheme } from '../Colors';

type Props = Omit<ViewProps, 'style'> & {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
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

export const UIBlurView = React.forwardRef<View, Props>(
    function UIBlurViewForwarded({
        style,
        ...rest
    }: Props, ref) {
        const color = useTheme()[ColorVariants.BackgroundOverlayInverted] as string;
        const blurStyle = getBlurStyle(color);

        return (
            <View
                ref={ref}
                {...rest}
                style={[
                    style,
                    blurStyle,
                ]}
            />
        );
    },
);
