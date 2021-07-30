import * as React from 'react';
import { ImageStyle, View } from 'react-native';
import { UIConstant as UICoreConstant } from '@tonlabs/uikit.core';
import { makeStyles, UIImage } from '@tonlabs/uikit.hydrogen';

import { useBubbleContainerStyle } from '../useBubblePosition';
import { useBubbleBackgroundColor } from '../useBubbleStyle';
import type { MediaMessage } from '../types';
import { UIConstant } from '../constants';

export const MediaImage: React.FC<MediaMessage> = (message: MediaMessage) => {
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const styles = useStyles();
    return (
        <View style={containerStyle} onLayout={message.onLayout}>
            <View style={[bubbleBackgroundColor, styles.bubble]}>
                <UIImage
                    source={{ uri: message.data }}
                    style={styles.image as ImageStyle}
                />
            </View>
        </View>
    );
};

const useStyles = makeStyles(() => ({
    bubble: {
        borderRadius: UICoreConstant.mediumBorderRadius(),
        overflow: 'hidden',
    },
    image: {
        width: UIConstant.mediaImageSize,
        height: UIConstant.mediaImageSize,
    },
}));
