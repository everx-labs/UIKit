import * as React from 'react';
import FastImage, { Source } from 'react-native-fast-image';
import type { MediaCardContent } from '../../types';

export function usePreload(content: MediaCardContent[]): void {
    return React.useEffect(() => {
        if (content.length === 0) {
            /**
             * Nothing to preload
             */
            return;
        }

        const imageToPreload: Source[] = [];

        content.forEach((contentItem: MediaCardContent): void => {
            if (contentItem.contentType === 'Image' && contentItem.source) {
                imageToPreload.push({ ...contentItem.source, cache: 'immutable' });
            }
        });

        if (imageToPreload.length > 0) {
            FastImage.preload(imageToPreload);
        }
    }, [content]);
}
