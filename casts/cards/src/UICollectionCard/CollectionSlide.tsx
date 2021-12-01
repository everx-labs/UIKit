import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { UIImage, UIVideo } from '@tonlabs/uikit.media';

import type { CollectionSlideProps } from './types';

const defaultDimension: LayoutRectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

function VideoSlide({ content, style }: CollectionSlideProps) {
    const [dimensions, setDimensions] = React.useState<LayoutRectangle>(defaultDimension);

    const onLayout = React.useCallback((event: LayoutChangeEvent) => {
        setDimensions(event.nativeEvent.layout);
    }, []);

    if (!content.source.uri) {
        return null;
    }

    return (
        <View style={[StyleSheet.absoluteFill, style]} onLayout={onLayout}>
            <UIVideo
                uri={content.source.uri}
                height={dimensions.height}
                width={dimensions.width}
                muted
                aspectRatio={1}
                repeat
                resizeMode="cover"
            />
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
