import * as React from 'react';
import type { StyleProp, ViewProps } from 'react-native';
import { BlurView } from '@react-native-community/blur';

type Props = Omit<BlurView, 'style'> & {
    style?: StyleProp<ViewProps>;
    children?: React.ReactNode;
};

export const UIBlurView = React.forwardRef<BlurView, Props>(
    function UIBlurViewForwarded({
        style,
        ...rest
    }: Props, ref) {
        return (
            <BlurView
                ref={ref}
                {...rest}
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
                style={[
                    style,
                ]}
            />
        );
    },
);
