import * as React from 'react';
import { UIConstant } from '../constants';
import type { MediaCardContent, MediaCardContentType } from '../types';

function getShowTime(contentType: MediaCardContentType): number | null {
    switch (contentType) {
        case 'Image':
            return UIConstant.uiCollectionCard.timeToShowImage;
        case 'Video':
            return UIConstant.uiCollectionCard.timeToShowVideo;
        case 'Unknown':
        default:
            return null;
    }
}

export function useCurrentSourceItemIndex(content?: MediaCardContent | MediaCardContent[] | null) {
    const [currentSourceItemIndex, setCurrentSourceItemIndex] = React.useState(0);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (Array.isArray(content) && content.length > 1) {
            const currentItem = content[currentSourceItemIndex];
            const showTime = getShowTime(currentItem.contentType);

            if (showTime !== null) {
                timeout = setTimeout(() => {
                    const nextIndex =
                        currentSourceItemIndex >= content.length - 1
                            ? 0
                            : currentSourceItemIndex + 1;
                    setCurrentSourceItemIndex(nextIndex);
                }, showTime);
            }
        }

        return () => clearTimeout(timeout);
    }, [content, currentSourceItemIndex]);

    return currentSourceItemIndex;
}
