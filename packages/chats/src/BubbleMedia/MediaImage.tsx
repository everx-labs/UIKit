import * as React from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import { UIConstant as UICoreConstant } from '@tonlabs/uikit.core';
import { makeStyles, UIImage } from '@tonlabs/uikit.hydrogen';

import { useBubbleContainerStyle } from '../useBubblePosition';
import { useBubbleBackgroundColor } from '../useBubbleStyle';
import type { MediaMessage } from '../types';
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
        width: newWidth,
        height: newHeight,
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
    const [imageSize, setImageSize] = React.useState<ImageSize | null>(null);
    const windowDimensions = useWindowDimensions();
    const maxImageSize = useMaxImageSize(windowDimensions.width);

    const saveImageSize = React.useCallback(
        (width: number, height: number) => {
            const newImageSize = getImageSize(
                width,
                height,
                maxImageSize.width,
                maxImageSize.height,
            );
            setImageSize(newImageSize);
        },
        [maxImageSize.width, maxImageSize.height],
    );

    React.useEffect(() => {
        if (message.data) {
            Image.getSize(message.data, saveImageSize);
        }
    }, [message.data, saveImageSize]);

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
                    resizeMode="contain"
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
