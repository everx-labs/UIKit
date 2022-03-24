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
     * Default: false
     */
    isLoading?: boolean;
    /**
     * Original dimensions of the image
     * Default: original size of the image
     */
    originalSize?: ImageSize;
    /**
     * The maximum height of the image. The skeleton will have this height.
     * Default: `UIConstant.lightbox.defaultMaxSize`
     */
    maxHeight?: number;
    /**
     * The maximum width of the image. The skeleton will have this width.
     * Default: container width
     */
    maxWidth?: number;
    /**
     * Callback function that is called when the image is loaded and ready to render
     */
    onLoad?: () => void;
    /**
     * Callback function that is called when the image cannot be loaded
     */
    onError?: (error: any) => void;
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
