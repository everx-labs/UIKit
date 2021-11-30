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

export function CollectionSlide({ content, style }: CollectionSlideProps) {
    const [dimensions, setDimensions] = React.useState<LayoutRectangle>(defaultDimension);
    const onLayout = (event: LayoutChangeEvent) => {
        setDimensions(event.nativeEvent.layout);
    };
    switch (content.contentType) {
        case 'Image':
            return (
                <View style={[StyleSheet.absoluteFill, style]}>
                    <UIImage source={content.source} style={StyleSheet.absoluteFill} />
                </View>
            );
        case 'Video':
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
        default:
            return null;
    }
}
