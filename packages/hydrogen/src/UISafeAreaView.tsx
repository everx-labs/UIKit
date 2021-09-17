import * as React from 'react';
import { ViewStyle, SafeAreaView, ColorValue } from 'react-native';
import type { ViewProps } from 'react-native';

import { ColorVariants, useTheme } from './Colors';

type Props = Omit<ViewProps, 'style'> & {
    color?: ColorVariants;
    style?: ViewStyle;
};

export const UISafeAreaView = React.forwardRef<SafeAreaView, Props>(
    function UISafeAreaViewForwarded(
        { color: colorProp = ColorVariants.BackgroundPrimary, style, ...rest }: Props,
        ref,
    ) {
        const theme = useTheme();
        const colorStyle: { backgroundColor: ColorValue } = React.useMemo(
            () => ({
                backgroundColor: theme[colorProp],
            }),
            [theme, colorProp],
        );
        return <SafeAreaView ref={ref} {...rest} style={[style, colorStyle]} />;
    },
);
