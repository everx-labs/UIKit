import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';

import type { PreviewProps } from './types';

export const Preview: React.FC<PreviewProps> = ({
    sourceList,
    style,
    contentType,
}: PreviewProps) => {
    if (contentType !== 'Image' || !sourceList || sourceList.length === 0) {
        return null;
    }
    return (
        <View style={style}>
            <UIImage source={sourceList[0]} style={StyleSheet.absoluteFill} />
        </View>
    );
};
