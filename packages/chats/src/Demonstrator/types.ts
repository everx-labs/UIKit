import type { View } from 'react-native';
import type Animated from 'react-native-reanimated';

export type Dimensions = {
    width: Animated.SharedValue<number>;
    height: Animated.SharedValue<number>;
    pageX: Animated.SharedValue<number>;
    pageY: Animated.SharedValue<number>;
};

export type DuplicateProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    originalRef: React.RefObject<View>;
};
