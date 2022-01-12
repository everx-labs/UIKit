import * as React from 'react';
import type { Image, ImageSourcePropType } from 'react-native';
import type { ImageSize } from '../types';
import { UIImage, UIImageProps } from '../../UIImage';
import { DuplicateImage } from '../../DuplicateImage';

const getImage = (
    imageSource: ImageSourcePropType,
    imageSize: ImageSize | null,
    onErrorCallback: () => void,
    onLoadCallback: () => void,
    previewRef: React.RefObject<Image> | null,
): React.ReactElement<UIImageProps> => {
    return (
        <UIImage
            ref={previewRef}
            source={imageSource}
            style={imageSize}
            onError={onErrorCallback}
            onLoad={onLoadCallback}
        />
    );
};

export const useImages = (
    image: ImageSourcePropType,
    preview: ImageSourcePropType | undefined,
    previewRef: React.RefObject<Image>,
    imageSize: ImageSize | null,
    onErrorCallback: () => void,
    onLoadCallback: () => void,
) => {
    return React.useMemo(() => {
        const fullSizeImage = getImage(image, imageSize, onErrorCallback, onLoadCallback, null);
        const previewImage = getImage(
            preview || image,
            imageSize,
            onErrorCallback,
            onLoadCallback,
            previewRef,
        );

        const duplicateOfPreviewImage = (
            <DuplicateImage source={previewRef} style={imageSize}>
                {previewImage}
            </DuplicateImage>
        );

        return {
            fullSizeImage,
            previewImage,
            duplicateOfPreviewImage,
        };
    }, [image, preview, previewRef, imageSize, onErrorCallback, onLoadCallback]);
};
