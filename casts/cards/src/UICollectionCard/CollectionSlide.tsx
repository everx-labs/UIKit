import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIImage, UIVideo } from '@tonlabs/uikit.media';

import type { CollectionSlideProps } from './types';

function VideoSlide({ content, style }: CollectionSlideProps) {
    if (!content.source.uri) {
        return null;
    }

    return (
        <View style={[StyleSheet.absoluteFill, style]}>
            <UIVideo uri={content.source.uri} muted repeat resizeMode="cover" />
        </View>
    );
}

function CollectionSlideImpl(props: CollectionSlideProps) {
    const { content, style } = props;
    switch (content.contentType) {
        case 'Image':
            return (
                <View style={[StyleSheet.absoluteFill, style]}>
                    <UIImage source={content.source} style={StyleSheet.absoluteFill} />
                </View>
            );
        case 'Video':
            return <VideoSlide {...props} />;
        default:
            return null;
    }
}

export const CollectionSlide = React.memo(CollectionSlideImpl);
