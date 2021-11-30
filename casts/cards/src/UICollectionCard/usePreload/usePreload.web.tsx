import * as React from 'react';
import { Image as RNImage } from 'react-native';
import type { Content } from '../types';

export const usePreload = (content: Content | Content[] | null): void => {
    return React.useEffect(() => {
        if (!content || (Array.isArray(content) && content.length === 0)) {
            /**
             * Nothing to preload
             */
            return;
        }

        if (Array.isArray(content)) {
            content.forEach((contentItem: Content): void => {
                if (
                    contentItem.contentType === 'Image' &&
                    contentItem.source &&
                    contentItem.source.uri
                ) {
                    RNImage.prefetch(contentItem.source.uri);
                }
            });
        } else if (content.source.uri) {
            RNImage.prefetch(content.source.uri);
        }
    }, [content]);
};
