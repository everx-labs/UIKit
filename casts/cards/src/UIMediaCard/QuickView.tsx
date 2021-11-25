import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';

import type { QuickViewProps } from './types';

export const QuickView: React.FC<QuickViewProps> = ({ source, style, contentType }: QuickViewProps) => {
    if (contentType !== 'Image' ||!source) {
        return null;
    }
    return (
        <View style={style}>
            <UIImage source={source} style={StyleSheet.absoluteFill} />
        </View>
    );
};
