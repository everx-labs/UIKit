import * as React from 'react';
import {
    Image,
    ImageErrorEventData,
    ImageSourcePropType,
    NativeSyntheticEvent,
    Platform,
} from 'react-native';
import type { ImageSize } from '../types';
import { UIImage, UIImageProps } from '../../UIImage';
import { DuplicateImage } from '../../DuplicateImage';

const getImage = (
    imageSource: ImageSourcePropType,
    imageSize: ImageSize | undefined,
    onErrorCallback: (error: NativeSyntheticEvent<ImageErrorEventData>) => void,
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

function getIsPreviewEmpty(preview: ImageSourcePropType | undefined): boolean {
    if (!preview) {
        return true;
    }
    if (Platform.OS === 'web') {
        return !(preview as any)?.uri;
    }
    return !Image.resolveAssetSource(preview).uri;
}

export const useImages = (
    image: ImageSourcePropType,
    preview: ImageSourcePropType | undefined,
    previewRef: React.RefObject<Image>,
    imageSize: ImageSize | undefined,
    onErrorCallback: (error: NativeSyntheticEvent<ImageErrorEventData>) => void,
    onLoadCallback: () => void,
): {
    fullSizeImage: React.ReactElement | null;
    previewImage: React.ReactElement;
    duplicateOfPreviewImage: React.ReactElement;
} => {
    return React.useMemo(() => {
        /**
         * If `preview` is empty, then the `image` will be displayed as a previewImage,
         * and we don't need the `fullSizeImage`, because we have only one image source.
         */
        const isPreviewEmpty = getIsPreviewEmpty(preview);
        const fullSizeImage: React.ReactElement | null = isPreviewEmpty
            ? null
            : getImage(image, imageSize, onErrorCallback, onLoadCallback, null);
        const previewImage: React.ReactElement = getImage(
            isPreviewEmpty ? image : preview || image,
            imageSize,
            onErrorCallback,
            onLoadCallback,
            previewRef,
        );

        const duplicateOfPreviewImage: React.ReactElement = (
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
