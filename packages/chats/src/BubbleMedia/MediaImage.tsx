import * as React from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import { UIConstant as UICoreConstant } from '@tonlabs/uikit.core';
import { makeStyles, TouchableOpacity } from '@tonlabs/uikit.hydrogen';

import { useBubbleContainerStyle } from '../useBubblePosition';
import { useBubbleBackgroundColor } from '../useBubbleStyle';
import { MediaMessage, MediaMessageError } from '../types';
import { UIConstant } from '../constants';
import { Lightbox } from '../Lightbox/Lightbox';

type ImageSize = {
    width: number;
    height: number;
};

const getImageSize = (
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

const useMaxImageSize = (windowWidth: number): ImageSize => {
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
const useImageCallback = (
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

const getImage = (
    imageRef: React.RefObject<Image>,
    sourceUri: string | null,
    imageSize: ImageSize | null,
    onErrorCallback: () => void,
    onLoadCallback: () => void,
) => {
    if (!sourceUri) {
        return null;
    }
    return (
        <Image
            ref={imageRef}
            source={{ uri: sourceUri }}
            style={imageSize}
            onError={onErrorCallback}
            onLoad={onLoadCallback}
        />
    );
};

const useImages = (
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

        const fullSizeComponent = getImage(
            imageRef,
            fullSizeSourceUri,
            imageSize,
            onErrorCallback,
            onLoadCallback,
        );
        const previewComponent = getImage(
            imageRef,
            previewSourceUri,
            imageSize,
            onErrorCallback,
            onLoadCallback,
        );

        return {
            fullSizeImage: fullSizeComponent,
            previewImage: previewComponent,
        };
    }, [data, preview, imageRef, imageSize, onErrorCallback, onLoadCallback]);
};

export const MediaImage: React.FC<MediaMessage> = (message: MediaMessage) => {
    const imageRef = React.useRef<Image>(null);
    const { onError, onLoad, preview, data, onLayout } = message;
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const styles = useStyles();
    const [imageOriginalSize, setImageOriginalSize] = React.useState<ImageSize | null>(null);
    const [imageSize, setImageSize] = React.useState<ImageSize | null>(null);
    const windowWidth = useWindowDimensions().width;

    const maxImageSize = useMaxImageSize(windowWidth);

    React.useEffect(() => {
        if (imageOriginalSize) {
            const newImageSize = getImageSize(
                imageOriginalSize?.width,
                imageOriginalSize?.height,
                maxImageSize.width,
                maxImageSize.height,
            );
            setImageSize(newImageSize);
        }
    }, [
        imageOriginalSize,
        imageOriginalSize?.width,
        imageOriginalSize?.height,
        maxImageSize.width,
        maxImageSize.height,
    ]);

    React.useEffect(() => {
        if (data) {
            Image.getSize(data, (width, height) =>
                setImageOriginalSize({
                    width,
                    height,
                }),
            );
        }
    }, [data]);

    const { onErrorCallback, onLoadCallback } = useImageCallback(data, onError, onLoad);

    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const { fullSizeImage, previewImage } = useImages(
        data,
        preview,
        imageRef,
        imageSize,
        onErrorCallback,
        onLoadCallback,
    );

    const onPress = React.useCallback(() => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    }, []);

    const onClose = React.useCallback(() => {
        setIsOpen(false);
    }, []);

    if (!previewImage || !fullSizeImage) {
        return null;
    }

    return (
        <View style={[containerStyle, styles.container]} onLayout={onLayout}>
            <TouchableOpacity activeOpacity={1} onPress={onPress}>
                <View style={[bubbleBackgroundColor, styles.bubble]}>
                    <Lightbox
                        imageRef={imageRef}
                        isOpen={isOpen}
                        onClose={onClose}
                        imageSize={imageSize}
                        fullSizeImage={fullSizeImage}
                        previewImage={previewImage}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const useStyles = makeStyles(() => ({
    container: {
        paddingRight: 0,
    },
    bubble: {
        borderRadius: UICoreConstant.mediumBorderRadius(),
        overflow: 'hidden',
    },
}));
