import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIImage, UIVideo } from '@tonlabs/uikit.media';

import type { CollectionSlideProps } from './types';

function VideoSlide({ content, style, onLoad, isVisible, onError }: CollectionSlideProps) {
    const onVideoLoadError = React.useCallback(() => {
        onError(new Error(`The video can't be loaded`));
    }, [onError]);

    if (!content.source.uri) {
        return null;
    }

    return (
        <View style={[StyleSheet.absoluteFill, style]}>
            <View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        opacity: isVisible ? 1 : 0,
                    },
                ]}
            >
                <UIVideo
                    uri={content.source.uri}
                    muted
                    repeat
                    resizeMode="cover"
                    onLoad={onLoad}
                    onError={onVideoLoadError}
                />
            </View>
        </View>
    );
}

function CollectionSlideImpl(props: CollectionSlideProps) {
    const { content, style, onLoad, isVisible, onError } = props;
    const { contentType } = content;

    React.useEffect(() => {
        if (contentType === 'Unknown') {
            onError(new Error('The content type is unknown'));
        }
    }, [contentType, onError]);

    const onImageLoadError = React.useCallback(() => {
        onError(new Error(`The image can't be loaded`));
    }, [onError]);

    switch (contentType) {
        case 'Image':
            return (
                <View style={[StyleSheet.absoluteFill, style]}>
                    <UIImage
                        source={content.source}
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                opacity: isVisible ? 1 : 0,
                            },
                        ]}
                        onLoad={onLoad}
                        onError={onImageLoadError}
                    />
                </View>
            );
        case 'Video':
            return <VideoSlide {...props} />;
        default:
            return null;
    }
}

export const CollectionSlide = React.memo(CollectionSlideImpl);
