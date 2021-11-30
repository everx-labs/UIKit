import * as React from 'react';
import FastImage, { Source } from 'react-native-fast-image';
import type { Content } from '../types';

export const usePreload = (content: Content | Content[] | null): void => {
    return React.useEffect(() => {
        if (!content || (Array.isArray(content) && content.length === 0)) {
            /**
             * Nothing to preload
             */
            return;
        }

        const imageToPreload: Source[] = [];

        if (Array.isArray(content)) {
            content.forEach((contentItem: Content): void => {
                if (contentItem.contentType === 'Image' && contentItem.source) {
                    imageToPreload.push({ ...contentItem.source, cache: 'immutable' });
                }
            });
        } else {
            imageToPreload.push({ ...content.source, cache: 'immutable' });
        }

        if (imageToPreload.length > 0) {
            FastImage.preload(imageToPreload);
        }
    }, [content]);
};
