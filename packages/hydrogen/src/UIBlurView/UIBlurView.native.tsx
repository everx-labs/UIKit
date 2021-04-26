import * as React from 'react';
import { View, ViewStyle} from 'react-native';
import type { StyleProp, ViewProps } from 'react-native';
import { ColorVariants, useTheme } from '../Colors';

type Props = Omit<ViewProps, 'style'> & {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
};

export const UIBlurView = React.forwardRef<View, Props>(
    function UIBlurViewForwarded({
        style,
        ...rest
    }: Props, ref) {
        const color = useTheme()[ColorVariants.BackgroundOverlayInverted] as string;

        return (
            <View
                ref={ref}
                {...rest}
                style={[
                    {
                        backgroundColor: color,
                    },
                    style,
                ]}
            />
        );
    },
);
