import * as React from 'react';
import { View } from 'react-native';
import { UIConstant as UICoreConstant } from '@tonlabs/uikit.core';
import { makeStyles } from '@tonlabs/uikit.themes';
import { UILightbox } from '@tonlabs/uikit.media';

import { useBubbleContainerStyle } from '../useBubblePosition';
import { useBubbleBackgroundColor } from '../useBubbleStyle';
import type { MediaMessage } from '../types';
import { useMaxImageSize } from './hooks';

export const MediaImage: React.FC<MediaMessage> = (message: MediaMessage) => {
    const { onError, onLoad, preview, data, onLayout, prompt } = message;
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const maxImageSize = useMaxImageSize();
    const styles = useStyles();

    if (!data) {
        return null;
    }

    return (
        <View style={[containerStyle, styles.container]} onLayout={onLayout}>
            <View style={[bubbleBackgroundColor, styles.bubble]}>
                <UILightbox
                    image={{ uri: data }}
                    preview={{ uri: preview || undefined }}
                    prompt={prompt}
                    maxHeight={maxImageSize.height}
                    maxWidth={maxImageSize.width}
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
