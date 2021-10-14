import * as React from 'react';
import { View, Image } from 'react-native';
import { UIConstant as UICoreConstant } from '@tonlabs/uikit.core';
import { makeStyles } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { Lightbox } from '@tonlabs/uikit.media';

import { useBubbleContainerStyle } from '../useBubblePosition';
import { useBubbleBackgroundColor } from '../useBubbleStyle';
import type { MediaMessage } from '../types';
import { useImageCallback, useImages, useImageSize } from './hooks';

export const MediaImage: React.FC<MediaMessage> = (message: MediaMessage) => {
    const imageRef = React.useRef<Image>(null);
    const { onError, onLoad, preview, data, onLayout, prompt } = message;
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const styles = useStyles();

    const imageSize = useImageSize(data);

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
            <TouchableOpacity
                activeOpacity={1}
                style={[bubbleBackgroundColor, styles.bubble]}
                onPress={onPress}
            >
                <Lightbox
                    imageRef={imageRef}
                    isOpen={isOpen}
                    onClose={onClose}
                    imageSize={imageSize}
                    fullSizeImage={fullSizeImage}
                    previewImage={previewImage}
                    prompt={prompt}
                />
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
