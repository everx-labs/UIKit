import * as React from 'react';
import { ViewStyle, View, ColorValue } from 'react-native';
import type { ViewProps } from 'react-native';

import { ColorVariants, useTheme } from './Colors';

type Props = Omit<ViewProps, 'style'> & {
    color?: ColorVariants,
    style?: ViewStyle;
    children?: React.ReactNode,
};

export const UIBackgroundView = React.forwardRef<View, Props>(
    function UIBackgroundViewForwarded(
        {
            color: colorProp = ColorVariants.BackgroundPrimary,
            style,
            ...rest
        }: Props, ref) {
        const theme = useTheme();
        const colorStyle: { backgroundColor: ColorValue } = React.useMemo(
            () => ({
                backgroundColor: theme[colorProp],
            }),
            [theme, colorProp],
        );
        return (
            <View
                ref={ref}
                {...rest}
                style={[
                    style,
                    colorStyle,
                ]}
            />
        );
    },
);

export const UIBackgroundViewColors = ColorVariants;
