import type { Image, View } from 'react-native';
import type Animated from 'react-native-reanimated';

export type ImageSize = {
    width: number;
    height: number;
};

export type LightboxProps = {
    isOpen: boolean;
    onClose: () => void;
    imageRef: React.RefObject<Image>;
    imageSize: ImageSize | null;
    fullSizeImage: React.ReactElement;
    previewImage: React.ReactElement;
};

export type Dimensions = {
    width: Animated.SharedValue<number>;
    height: Animated.SharedValue<number>;
    pageX: Animated.SharedValue<number>;
    pageY: Animated.SharedValue<number>;
};

export type DuplicateProps = {
    onClose: () => void;
    originalRef: React.RefObject<View>;
    fullSizeImage: React.ReactElement;
    previewImage: React.ReactElement;
};

export type ZoomProps = {
    contentWidth: Readonly<Animated.SharedValue<number>>;
    contentHeight: Readonly<Animated.SharedValue<number>>;
    onClose: () => void;
    underlayOpacity: Animated.SharedValue<number>;
    visibilityState: Readonly<Animated.SharedValue<number>>;
    children: (React.ReactElement | null)[] | React.ReactElement;
};

export type PanGestureEventContext = {
    startX: number;
    startY: number;
};
