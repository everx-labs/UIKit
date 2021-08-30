import type {
    StyleProp,
    TouchableOpacityProps as RNTouchableOpacityProps,
    ViewStyle,
} from 'react-native';

export interface TouchableOpacityProps extends RNTouchableOpacityProps {
    containerStyle?: StyleProp<ViewStyle>;
    waitFor?: React.RefObject<any> | null;
}
