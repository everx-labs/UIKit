import type * as React from 'react';
import Animated from 'react-native-reanimated';
import type {
    NativeViewGestureHandlerProps,
    RawButtonProps,
} from 'react-native-gesture-handler';
import type { StyleProp, ViewStyle } from 'react-native';
import { RawButton as GHRawButton } from 'react-native-gesture-handler';

export const RawButton: React.FunctionComponent<Animated.AnimateProps<
    RawButtonProps &
        NativeViewGestureHandlerProps & {
            testID?: string;
            style?: StyleProp<ViewStyle>;
        }
>> = Animated.createAnimatedComponent(GHRawButton);
