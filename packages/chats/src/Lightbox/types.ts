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
    originalRef: React.RefObject<View>;
    fullSizeImage: React.ReactElement;
    previewImage: React.ReactElement;
};

export type DuplicateContentProps = {
    onClose: () => void;
    originalRef: React.RefObject<View>;
    fullSizeImage: React.ReactElement;
    previewImage: React.ReactElement;
};

export type ZoomProps = {
    children: (React.ReactElement | null)[] | React.ReactElement;
};

export type PanGestureEventContext = {
    startX: number;
    startY: number;
};
