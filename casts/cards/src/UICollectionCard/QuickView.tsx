import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';

import type { QuickViewProps } from './types';

export const QuickView: React.FC<QuickViewProps> = ({ imageSourceList, style }: QuickViewProps) => {
    if (!imageSourceList || imageSourceList.length === 0) {
        return null;
    }
    return (
        <View style={style}>
            <UIImage source={imageSourceList[0]} style={StyleSheet.absoluteFill} />
        </View>
    );
};
