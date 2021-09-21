import * as React from 'react';
import { ViewStyle, View, ColorValue } from 'react-native';
import type { StyleProp, ViewProps } from 'react-native';

import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

type Props = Omit<ViewProps, 'style'> & {
    color?: ColorVariants;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
};

export function useBackgroundColorStyle(colorProp = ColorVariants.BackgroundPrimary) {
    const theme = useTheme();
    const colorStyle: { backgroundColor: ColorValue } = React.useMemo(
        () => ({
            backgroundColor: theme[colorProp] as string,
        }),
        [theme, colorProp],
    );

    return colorStyle;
}

export const UIBackgroundView = React.forwardRef<View, Props>(function UIBackgroundViewForwarded(
    { color: colorProp = ColorVariants.BackgroundPrimary, style, ...rest }: Props,
    ref,
) {
    const colorStyle = useBackgroundColorStyle(colorProp);
    return <View ref={ref} {...rest} style={[style, colorStyle]} />;
});

export const UIBackgroundViewColors = ColorVariants;
