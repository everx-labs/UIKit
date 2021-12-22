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

export function useCurrentSourceItemIndex(
    content: MediaCardContent | MediaCardContent[] | null | undefined,
    availableList: number[],
) {
    const [currentAvailableListIndex, setCurrentAvailableListIndex] = React.useState(-1);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (Array.isArray(content) && content.length > 0) {
            const currentItem: MediaCardContent | undefined =
                content[availableList[currentAvailableListIndex]];
            if (currentItem) {
                const showTime = getShowTime(currentItem.contentType);

                if (showTime !== null) {
                    timeout = setTimeout(() => {
                        const nextIndex =
                            currentAvailableListIndex >= availableList.length - 1
                                ? 0
                                : currentAvailableListIndex + 1;
                        setCurrentAvailableListIndex(nextIndex);
                    }, showTime);
                }
            } else if (availableList.length > 0) {
                setCurrentAvailableListIndex(0);
            }
        }

        return () => clearTimeout(timeout);
    }, [content, availableList, currentAvailableListIndex]);

    return availableList[currentAvailableListIndex];
}
