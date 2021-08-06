import * as React from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import { UIConstant as UICoreConstant } from '@tonlabs/uikit.core';
import { makeStyles, UIImage } from '@tonlabs/uikit.hydrogen';

import { useBubbleContainerStyle } from '../useBubblePosition';
import { useBubbleBackgroundColor } from '../useBubbleStyle';
import { MediaMessage, MediaMessageError } from '../types';
import { UIConstant } from '../constants';

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

export const MediaImage: React.FC<MediaMessage> = (message: MediaMessage) => {
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const styles = useStyles();
    const [
        imageOriginalSize,
        setImageOriginalSize,
    ] = React.useState<ImageSize | null>(null);
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
        if (message.data) {
            Image.getSize(message.data, (width, height) =>
                setImageOriginalSize({
                    width,
                    height,
                }),
            );
        }
    }, [message.data]);

    if (!message.data) {
        return null;
    }
    return (
        <View
            style={[containerStyle, styles.container]}
            onLayout={message.onLayout}
        >
            <View style={[bubbleBackgroundColor, styles.bubble]}>
                <UIImage
                    source={{ uri: message.data }}
                    style={imageSize}
                    onError={() => {
                        if (message.onError) {
                            message.onError(MediaMessageError.InvalidData);
                        }
                    }}
                    onLoad={message.onLoad}
                />
            </View>
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
