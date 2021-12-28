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

/**
 * Hook to get the current source item index
 * @param contentList - a list of all content previews
 * @param availableList - a React reference to the list of available previews
 * @returns an index of the current source
 */
export function useCurrentSourceItem(
    contentList: MediaCardContent[] | undefined,
    availableList: React.MutableRefObject<number[]>,
    failureIndexList: React.MutableRefObject<number[]>,
): MediaCardContent | undefined {
    const [currentAvailableListIndex, setCurrentAvailableListIndex] = React.useState(0);

    const currentItemIndex = React.useMemo<number>(() => {
        // We consider the first item as always "available" even if it's not
        return availableList.current[currentAvailableListIndex] ?? 0;
    }, [availableList, currentAvailableListIndex]);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;

        if (!contentList || contentList.length < 2) {
            // No need to iterate through the items
        } else {
            const index = availableList.current[currentAvailableListIndex];
            if (index == null) {
                // No items are available yet... Need to wait until they appear.
                // Note: if items do not appear, they should automatically fill `failureIndexList`.
                // Hence there is no need to wait if all of them fail to load!.
                if (failureIndexList.current.length !== contentList?.length) {
                    // Trigger the effect one more time in a sec to check the available list again
                    timeout = setTimeout(() => setCurrentAvailableListIndex(0), 1000);
                } else {
                    // No need to iterate through failed items
                }
            } else {
                const currentItem: MediaCardContent | undefined = contentList[index];
                if (!currentItem) {
                    throw new Error('Current item is not found among available items');
                }

                // Change the current available index in a while if possible
                const showTime = getShowTime(currentItem.contentType);
                if (showTime !== null) {
                    timeout = setTimeout(() => {
                        const nextIndex =
                            currentAvailableListIndex >= availableList.current.length - 1
                                ? 0
                                : currentAvailableListIndex + 1;
                        setCurrentAvailableListIndex(nextIndex);
                    }, showTime);
                } else {
                    // Stop the iteration
                }
            }
        }

        return () => {
            if (timeout != null) {
                clearTimeout(timeout);
            }
        };
    }, [availableList, contentList, currentAvailableListIndex, failureIndexList]);

    return contentList ? contentList[currentItemIndex] : undefined;
}
