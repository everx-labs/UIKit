import type * as React from 'react';
import Animated from 'react-native-reanimated';
import {
    RawButton as GHRawButton,
    NativeViewGestureHandlerProps,
    RawButtonProps,
} from 'react-native-gesture-handler';
import type { StyleProp, ViewStyle } from 'react-native';

export const RawButton: React.FunctionComponent<
    Animated.AnimateProps<
        RawButtonProps &
            NativeViewGestureHandlerProps & {
                testID?: string;
                style?: StyleProp<ViewStyle>;
            }
    >
> = Animated.createAnimatedComponent(GHRawButton);
