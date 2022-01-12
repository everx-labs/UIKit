import * as React from 'react';
import { Image, ImageResolvedAssetSource, ImageSourcePropType } from 'react-native';
import { UIConstant } from '../../constants';
import type { ImageSize } from '../types';

export const getImageSize = (width: number, height: number, maxWidth: number): ImageSize => {
    let newWidth = width;
    let newHeight = height;
    const aspectRatio = width / height;

    if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
    }

    return {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
    };
};

export const useImageSize = (
    imageSource: ImageSourcePropType,
    originalSize: ImageSize | undefined,
    containerWidth: number,
) => {
    const [imageSize, setImageSize] = React.useState<ImageSize | null>(null);
    const originalSizeRef = React.useRef<ImageSize | null>(originalSize ?? null);

    /**
     * `containerWidth` has changed
     */
    React.useEffect(() => {
        if (originalSizeRef.current !== null) {
            const newImageSize = getImageSize(
                originalSizeRef.current.width,
                originalSizeRef.current.height,
                containerWidth,
            );
            setImageSize(newImageSize);
        }
    }, [containerWidth]);

    /**
     * `imageSource` has changed
     */
    React.useEffect(() => {
        if (imageSource && !originalSize) {
            const imageResolvedAssetSource: ImageResolvedAssetSource =
                Image.resolveAssetSource(imageSource);
            Image.getSize(
                imageResolvedAssetSource.uri,
                (width, height) => {
                    originalSizeRef.current = {
                        width,
                        height,
                    };
                    const newImageSize = getImageSize(
                        originalSizeRef.current?.width,
                        originalSizeRef.current?.height,
                        containerWidth,
                    );
                    setImageSize(newImageSize);
                },
                /**
                 * For the cases when we want to use some placeholder instead of the failed image
                 * and provide it with some sizes
                 */
                () => {
                    const placeholderSize =
                        containerWidth < UIConstant.lightbox.placeholderMaxSize
                            ? containerWidth
                            : UIConstant.lightbox.placeholderMaxSize;
                    setImageSize({
                        width: placeholderSize,
                        height: placeholderSize,
                    });
                },
            );
        }
        /**
         * `containerWidth` is not added to the list of dependencies,
         * because we do not want re-call of the Image.getSize
         * every time the screen size changes.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageSource]);

    return imageSize;
};
