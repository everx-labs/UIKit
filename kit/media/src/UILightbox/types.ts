import type { View } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { UIImageProps } from '../UIImage';

export type ImageSize = {
    width: number;
    height: number;
};

export type UILightboxProps = {
    /**
     * The source of the image in HIGH resolution
     */
    image: UIImageProps['source'];
    /**
     * The source of the image in LOW resolution
     */
    preview?: UIImageProps['source'];
    /**
     * Description under the picture, which is displayed in full-screen mode
     */
    prompt?: string;
    /**
     * Used to display the data loading process
     */
    isLoading?: boolean;
    /**
     * Original dimensions of the image
     */
    originalSize?: ImageSize;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type Dimensions = {
    width: Animated.SharedValue<number>;
    height: Animated.SharedValue<number>;
    pageX: Animated.SharedValue<number>;
    pageY: Animated.SharedValue<number>;
};

export type DuplicateProps = DuplicateContentProps & {
    isOpen: boolean;
};

export type DuplicateContentProps = {
    onClose: () => void;
    forwardedRef: React.RefObject<View>;
    fullSizeImage?: React.ReactElement | null;
    previewImage: React.ReactElement;
    prompt?: string;
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
