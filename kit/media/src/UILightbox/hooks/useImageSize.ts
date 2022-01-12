import * as React from 'react';
import { Image, ImageResolvedAssetSource, ImageSourcePropType, Platform } from 'react-native';
import { UIConstant } from '../../constants';
import type { ImageSize } from '../types';

export const getImageSize = (
    width: number,
    height: number,
    maxHeight: number,
    maxWidth: number | undefined,
): ImageSize => {
    let newWidth = width;
    let newHeight = height;
    const aspectRatio = width / height;

    if (maxWidth && newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
    }

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
    }

    return {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
    };
};

export const useImageSize = (
    imageSource: ImageSourcePropType,
    originalSize: ImageSize | undefined,
    maxHeight: number,
    maxWidth: number | undefined,
) => {
    const originalSizeRef = React.useRef<ImageSize | undefined>(originalSize);
    const [imageSize, setImageSize] = React.useState<ImageSize | undefined>(originalSize);

    const calculateSize = React.useCallback(
        function calculateSize(uri: string) {
            Image.getSize(
                uri,
                (width, height) => {
                    const newImageSize = getImageSize(width, height, maxHeight, maxWidth);
                    if (
                        newImageSize.width !== imageSize?.width ||
                        newImageSize.height !== imageSize?.height
                    ) {
                        originalSizeRef.current = newImageSize;
                        setImageSize(newImageSize);
                    }
                },
                /**
                 * For the cases when we want to use some placeholder instead of the failed image
                 * and provide it with some sizes
                 */
                () => {
                    const placeholderSize =
                        maxWidth && maxWidth < UIConstant.lightbox.defaultMaxSize
                            ? maxWidth
                            : UIConstant.lightbox.defaultMaxSize;
                    setImageSize({
                        width: placeholderSize,
                        height: placeholderSize,
                    });
                },
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [maxHeight, maxWidth],
    );

    /**
     * `maxHeight` or `maxWidth` have changed
     */
    React.useEffect(() => {
        if (originalSizeRef.current) {
            const newImageSize = getImageSize(
                originalSizeRef.current.width,
                originalSizeRef.current.height,
                maxHeight,
                maxWidth,
            );
            setImageSize(newImageSize);
        }
    }, [maxHeight, maxWidth]);

    React.useEffect(() => {
        if (originalSize) {
            const newImageSize = getImageSize(
                originalSize.width,
                originalSize.height,
                maxHeight,
                maxWidth,
            );
            setImageSize(newImageSize);
        } else {
            if (Platform.OS === 'web') {
                const uri = (imageSource as any)?.uri;
                const height = (imageSource as any)?.height;
                const width = (imageSource as any)?.width;
                if (height && width) {
                    // DO NOTHING
                    console.log('DO NOTHING');
                } else {
                    calculateSize(uri);
                }
            }
            if (Platform.OS !== 'web') {
                const imageResolvedAssetSource: ImageResolvedAssetSource =
                    Image.resolveAssetSource(imageSource);
                if (imageResolvedAssetSource.width && imageResolvedAssetSource.height) {
                    setImageSize({
                        width: imageResolvedAssetSource.width,
                        height: imageResolvedAssetSource.height,
                    });
                } else {
                    calculateSize(imageResolvedAssetSource.uri);
                }
            }
        }
        /**
         * `maxHeight` and `maxWidth` are not added to the list of dependencies,
         * because we do not want re-call of the Image.getSize
         * every time the screen size changes.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageSource, originalSize, calculateSize]);

    return imageSize;
};
