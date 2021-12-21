import * as React from 'react';
import { UIImage } from '@tonlabs/uikit.media';
import type { ImageURISource } from 'react-native';

import type { MediaCardContent } from '../types';
import type { PreviewProps } from './types';
import { CollectionSlide } from './CollectionSlide';
import { useCurrentSourceItemIndex } from './useCurrentSourceItemIndex';

export function Preview({ style, contentList }: PreviewProps) {
    React.useEffect(() => {
        const imageList: ImageURISource[] = [];
        contentList?.forEach((value: MediaCardContent) => {
            if (value.contentType === 'Image') {
                imageList.push(value.source);
            }
        });
        UIImage.prefetch(imageList);
    }, [contentList]);

    const currentSourceItemIndex = useCurrentSourceItemIndex(contentList);

    const currentContent: MediaCardContent | null = React.useMemo(() => {
        return contentList ? contentList[currentSourceItemIndex] : null;
    }, [currentSourceItemIndex, contentList]);

    if (!contentList || contentList.length === 0 || !currentContent) {
        return null;
    }

    return <CollectionSlide content={contentList[currentSourceItemIndex]} style={style} />;
}
