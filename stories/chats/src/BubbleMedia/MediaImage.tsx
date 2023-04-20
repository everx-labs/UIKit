import * as React from 'react';
import { View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles } from '@tonlabs/uikit.themes';
import { UILightbox } from '@tonlabs/uikit.media';

import { useBubbleContainerStyle } from '../useBubblePosition';
import { useBubbleBackgroundColor } from '../useBubbleStyle';
import type { MediaMessage } from '../types';
import { useMaxImageSize } from './hooks';
import { MediaMessageError } from '../constants';

export function MediaImage(message: MediaMessage) {
    const { onError, onLoad, preview, data, onLayout, prompt } = message;
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const maxImageSize = useMaxImageSize();

    const onErrorCallback = React.useCallback(
        function onErrorCallback() {
            onError && onError(MediaMessageError.InvalidData);
        },
        [onError],
    );

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
                    onError={onErrorCallback}
                    onLoad={onLoad}
                />
            </View>
        </View>
    );
}

const useStyles = makeStyles(() => ({
    container: {
        paddingRight: 0,
    },
    bubble: {
        borderRadius: UILayoutConstant.mediumBorderRadius,
        overflow: 'hidden',
    },
}));
