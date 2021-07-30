import * as React from 'react';
import { ViewStyle, View, ColorValue } from 'react-native';
import type { StyleProp, ViewProps } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { ColorVariants, useTheme } from './Colors';

type Props = Omit<ViewProps, 'style'> & {
    color?: ColorVariants;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
};

export const UIBackgroundView2 = React.forwardRef<View, Props>(
    function UIBackgroundViewForwarded(
        {
            color: colorProp = ColorVariants.BackgroundPrimary,
            style,
            ...rest
        }: Props,
        ref,
    ) {
        const theme = useTheme();
        const colorStyle: { backgroundColor: ColorValue } = React.useMemo(
            () => ({
                backgroundColor: theme[colorProp],
            }),
            [theme, colorProp],
        );
        return <View ref={ref} {...rest} style={[style, colorStyle]} />;
    },
);

export const UIBackgroundView = React.forwardRef<View, Props>(
    function UIBackgroundView2Forwarded(
        {
            color: colorProp = ColorVariants.BackgroundPrimary,
            style,
            ...rest
        }: Props,
        ref,
    ) {
        const theme = useTheme();

        const previousColor = useSharedValue(theme[colorProp] as string);
        const currentColor = useSharedValue(theme[colorProp] as string);
        const transitionProgress = useSharedValue(1);

        React.useEffect(() => {
            if (transitionProgress.value !== 0) {
                previousColor.value = currentColor.value;
                currentColor.value = theme[colorProp] as string;
                transitionProgress.value = 0;
                transitionProgress.value = withTiming(1, { duration: 100 });
            }
        }, [colorProp, theme, previousColor, currentColor, transitionProgress]);

        const colorStyle = useAnimatedStyle(() => {
            return {
                backgroundColor: interpolateColor(
                    transitionProgress.value,
                    [0, 1],
                    [previousColor.value, currentColor.value],
                ),
            };
        });
        return (
            // @ts-ignore
            <Animated.View ref={ref} {...rest} style={[style, colorStyle]} />
        );
    },
);

export const UIBackgroundViewColors = ColorVariants;
