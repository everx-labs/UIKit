import * as React from 'react';
import { ViewStyle, View, ColorValue } from 'react-native';
import type { ViewProps } from 'react-native';

import { ColorVariants, useTheme } from './Colors';

type Props = Omit<ViewProps, 'style'> & {
    color?: ColorVariants,
    style?: ViewStyle;
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
            [colorProp],
        );
        return (
            <View
                ref={ref}
                {...rest}
                style={[
                    colorStyle,
                    style,
                ]}
            />
        );
    },
);

export const UIBackgroundViewColors = ColorVariants;
