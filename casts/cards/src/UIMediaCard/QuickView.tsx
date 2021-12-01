import * as React from 'react';
// import { View } from 'react-native';
// import { UIImage } from '@tonlabs/uikit.media';

import type { QuickViewProps } from './types';
import { CollectionSlide } from '../UICollectionCard/CollectionSlide';

export const QuickView: React.FC<QuickViewProps> = ({ content, style }: QuickViewProps) => {
    if (!content) {
        return null;
    }
    /**
     * TODO It is necessary to implement it's own implementation for quick viewing by long tap
     */
    return <CollectionSlide content={content} style={style} />;
};
