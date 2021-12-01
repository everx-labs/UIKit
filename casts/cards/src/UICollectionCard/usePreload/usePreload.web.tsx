import * as React from 'react';
import { Image as RNImage } from 'react-native';
import type { MediaCardContent } from '../../types';

export function usePreload(content: MediaCardContent[]): void {
    return React.useEffect(() => {
        if (content.length === 0) {
            /**
             * Nothing to preload
             */
            return;
        }

        content.forEach((contentItem: MediaCardContent): void => {
            if (
                contentItem.contentType === 'Image' &&
                contentItem.source &&
                contentItem.source.uri
            ) {
                RNImage.prefetch(contentItem.source.uri);
            }
        });
    }, [content]);
}
