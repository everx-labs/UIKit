import * as React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';

import type { PreviewProps } from './types';

export function Preview({ source, style, contentType }: PreviewProps) {
    if (contentType !== 'Image' || !source || (Array.isArray(source) && source.length === 0)) {
        return null;
    }
    const currentSource: ImageSourcePropType = Array.isArray(source) ? source[0] : source;
    return (
        <View style={style}>
            <UIImage source={currentSource} style={StyleSheet.absoluteFill} />
        </View>
    );
}
