import * as React from 'react';
import { Image as RNImage } from 'react-native';
import type { Content } from '../types';

export const usePreload = (content: Content[] | null): void => {
    return React.useEffect(() => {
        if (!content || content.length === 0) {
            /**
             * Nothing to preload
             */
            return;
        }

        content.forEach((contentItem: Content): void => {
            if (
                contentItem.contentType === 'Image' &&
                contentItem.source &&
                contentItem.source.uri
            ) {
                RNImage.prefetch(contentItem.source.uri);
            }
        });
    }, [content]);
};
