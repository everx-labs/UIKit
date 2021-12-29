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

const styles = StyleSheet.create({
    slideVisible: { transform: [{ translateX: 0 }, { translateY: 0 }] },
    slideInvisible: { transform: [{ translateX: -9999 }, { translateY: -9999 }] },
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
        <View style={[StyleSheet.absoluteFill, style, visibility]}>
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
