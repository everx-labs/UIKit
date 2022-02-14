import Animated from 'react-native-reanimated';
import {
    RawButton as GHRawButton,
    NativeViewGestureHandlerProps,
    RawButtonProps,
} from 'react-native-gesture-handler';
import type { StyleProp, ViewStyle } from 'react-native';

export const RawButton = Animated.createAnimatedComponent<
    RawButtonProps &
        NativeViewGestureHandlerProps & {
            testID?: string;
            style?: StyleProp<ViewStyle>;
        }
>(GHRawButton);
