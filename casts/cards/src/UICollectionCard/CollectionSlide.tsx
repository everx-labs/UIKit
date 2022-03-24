import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { UIImage, UIVideo } from '@tonlabs/uikit.media';

import type { CollectionSlideProps } from './types';

const ImageSlide = React.memo(function ImageSlide({
    content,
    onLoad,
    onError,
}: Pick<CollectionSlideProps, 'content' | 'onLoad' | 'onError'>) {
    const onImageLoad = React.useCallback(() => {
        onLoad(content);
    }, [content, onLoad]);

    const onImageLoadError = React.useCallback(() => {
        onError(new Error(`The image can't be loaded`), content);
    }, [content, onError]);

    if (!content.source.uri) {
        return null;
    }

    return (
        <UIImage
            source={content.source}
            style={StyleSheet.absoluteFill}
            onLoad={onImageLoad}
            onError={onImageLoadError}
        />
    );
});

const VideoSlide = React.memo(function VideoSlide({
    content,
    onLoad,
    onError,
}: Pick<CollectionSlideProps, 'content' | 'onLoad' | 'onError'>) {
    const onVideoLoad = React.useCallback(() => {
        onLoad(content);
    }, [content, onLoad]);

    const onVideoLoadError = React.useCallback(() => {
        onError(new Error(`The video can't be loaded`), content);
    }, [content, onError]);

    if (!content.source.uri) {
        return null;
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <UIVideo
                uri={content.source.uri}
                muted
                repeat
                resizeMode="cover"
                onLoad={onVideoLoad}
                onError={onVideoLoadError}
            />
        </View>
    );
});

const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

const styles = StyleSheet.create({
    // Make it invisible my moving out of the screen to reduce GPU work:
    // https://www.objc.io/issues/3-views/moving-pixels-onto-the-screen/
    slideInvisible: {
        position: 'absolute',
        top: -FAR_FAR_AWAY,
        left: -FAR_FAR_AWAY,
        right: FAR_FAR_AWAY,
        bottom: FAR_FAR_AWAY,
    },
    slideVisible: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

function CollectionSlideImpl({ content, onLoad, onError, style, isVisible }: CollectionSlideProps) {
    const { contentType } = content;

    React.useEffect(() => {
        if (contentType === 'Unknown') {
            onError(new Error('The content type is unknown'), content);
        }
    }, [content, contentType, onError]);

    const visibility = React.useMemo<StyleProp<ViewStyle>>(() => {
        return isVisible ? styles.slideVisible : styles.slideInvisible;
    }, [isVisible]);

    return (
        <View style={[style, visibility]}>
            {contentType === 'Image' && (
                <ImageSlide content={content} onLoad={onLoad} onError={onError} />
            )}
            {contentType === 'Video' && (
                <VideoSlide content={content} onLoad={onLoad} onError={onError} />
            )}
        </View>
    );
}

export const CollectionSlide = React.memo(CollectionSlideImpl);
