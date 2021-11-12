import * as React from 'react';
import { Image, useWindowDimensions } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';

import { MediaMessageError, UIConstant } from '../constants';
import type { ImageSize } from './types';

export const getImageSize = (
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
): ImageSize => {
    let newWidth = width;
    let newHeight = height;
    const aspectRatio = width / height;

    if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
    }
    if (newHeight > maxHeight) {
        newWidth = maxHeight * aspectRatio;
        newHeight = maxHeight;
    }

    return {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
    };
};

export const useMaxImageSize = (windowWidth: number): ImageSize => {
    return React.useMemo(() => {
        return {
            width: windowWidth * UIConstant.mediaImagePartOfScreen,
            height:
                (windowWidth * UIConstant.mediaImagePartOfScreen) /
                UIConstant.mediaImageMaxSizesAspectRatio,
        };
    }, [windowWidth]);
};

/**
 * It is necessary in order not to call callbacks `onError` and `onLoad` at each re-render
 */
export const useImageCallback = (
    data: string | null,
    onError: ((error: MediaMessageError) => void) | undefined,
    onLoad: (() => void) | undefined,
) => {
    const isFirstRenderRef = React.useRef<boolean>(false);

    const onErrorCallback = React.useCallback(() => {
        if (onError && isFirstRenderRef.current) {
            onError(MediaMessageError.InvalidData);
            isFirstRenderRef.current = false;
        }
    }, [onError]);

    const onLoadCallback = React.useCallback(() => {
        if (onLoad && isFirstRenderRef.current) {
            onLoad();
            isFirstRenderRef.current = false;
        }
    }, [onLoad]);

    React.useEffect(() => {
        isFirstRenderRef.current = true;
    }, [data]);

    return {
        onErrorCallback,
        onLoadCallback,
    };
};

export const getImage = (
    sourceUri: string | null,
    imageSize: ImageSize | null,
    onErrorCallback: () => void,
    onLoadCallback: () => void,
    imageRef: React.RefObject<Image> | null,
) => {
    if (!sourceUri) {
        return null;
    }

    return (
        <UIImage
            ref={imageRef}
            source={{ uri: sourceUri }}
            style={imageSize}
            onError={onErrorCallback}
            onLoad={onLoadCallback}
        />
    );
};

export const useImages = (
    data: string | null,
    preview: string | null,
    imageRef: React.RefObject<Image>,
    imageSize: ImageSize | null,
    onErrorCallback: () => void,
    onLoadCallback: () => void,
) => {
    return React.useMemo(() => {
        let fullSizeSourceUri: string | null = null;
        let previewSourceUri: string | null = null;

        if (data) {
            fullSizeSourceUri = data;
        } else if (preview) {
            fullSizeSourceUri = preview;
        }

        if (preview) {
            previewSourceUri = preview;
        } else if (data) {
            previewSourceUri = data;
        }

        const fullSizeImage =
            fullSizeSourceUri !== previewSourceUri
                ? getImage(fullSizeSourceUri, imageSize, onErrorCallback, onLoadCallback, null)
                : null;
        const previewImage = getImage(
            previewSourceUri,
            imageSize,
            onErrorCallback,
            onLoadCallback,
            imageRef,
        );

        return {
            fullSizeImage,
            previewImage,
        };
    }, [data, preview, imageRef, imageSize, onErrorCallback, onLoadCallback]);
};

export const useImageSize = (data: string | null, originalSize?: ImageSize) => {
    const [imageSize, setImageSize] = React.useState<ImageSize | null>(null);
    const originalSizeRef = React.useRef<ImageSize | null>(
        originalSize === undefined ? null : originalSize,
    );
    const windowWidth = useWindowDimensions().width;
    const maxImageSize = useMaxImageSize(windowWidth);

    /**
     * `maxImageSize` has changed
     */
    React.useEffect(() => {
        if (originalSizeRef.current !== null) {
            const newImageSize = getImageSize(
                originalSizeRef.current.width,
                originalSizeRef.current.height,
                maxImageSize.width,
                maxImageSize.height,
            );
            setImageSize(newImageSize);
        }
    }, [maxImageSize.width, maxImageSize.height]);

    /**
     * `data` has changed
     */
    React.useEffect(() => {
        if (data && !originalSize) {
            Image.getSize(data, (width, height) => {
                originalSizeRef.current = {
                    width,
                    height,
                };
                const newImageSize = getImageSize(
                    originalSizeRef.current?.width,
                    originalSizeRef.current?.height,
                    maxImageSize.width,
                    maxImageSize.height,
                );
                setImageSize(newImageSize);
            });
        }
        /**
         * `maxImageSize` is not added to the list of dependencies,
         * because we do not want re-call of the Image.getSize
         * every time the screen size changes.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return imageSize;
};
