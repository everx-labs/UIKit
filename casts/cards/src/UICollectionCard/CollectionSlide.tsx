import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIImage, UIVideo } from '@tonlabs/uikit.media';

import type { CollectionSlideProps } from './types';

function VideoSlide({ content, style, onLoad, isVisible, onError }: CollectionSlideProps) {
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
                    onError={onError}
                />
            </View>
        </View>
    );
}

function CollectionSlideImpl(props: CollectionSlideProps) {
    const { content, style, onLoad, isVisible, onError } = props;
    switch (content.contentType) {
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
                        onError={onError}
                    />
                </View>
            );
        case 'Video':
            return <VideoSlide {...props} />;
        default:
            setTimeout(() => onError());
            return null;
    }
}

export const CollectionSlide = React.memo(CollectionSlideImpl);
