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
 * @param contentList - a items of all content previews
 * @param availableList - a React reference to the items of available previews
 * @returns an index of the current source
 */
export function useCurrentSourceItem(
    contentList: MediaCardContent[] | undefined,
    availableList: React.MutableRefObject<number[]>,
    failureIndexList: React.MutableRefObject<number[]>,
): MediaCardContent | undefined {
    const isMounted = React.useRef<boolean>(false);

    const [currentAvailableListIndex, setCurrentAvailableListIndex] = React.useState(0);

    const currentItemIndex = React.useMemo<number>(() => {
        // We consider the first item as always "available" even if it's not
        return availableList.current[currentAvailableListIndex] ?? 0;
    }, [availableList, currentAvailableListIndex]);

    React.useEffect(() => {
        isMounted.current = true;
        () => {
            isMounted.current = false;
        };
    }, []);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout | number | undefined;

        function iterateThroughItems(items: MediaCardContent[]) {
            if (availableList.current.length < 2) {
                // Either no items are available yet or only one item is loaded...
                // Need to wait until more are loaded in order to change the current item.

                // Note: if items do not appear, they should automatically fill `failureIndexList`.
                // Hence there is no need to wait if all the rest items fail to load!.
                if (
                    items.length !==
                    availableList.current.length + failureIndexList.current.length
                ) {
                    // Trigger the effect one more time in a sec to check the available items again
                    timeout = setTimeout(() => iterateThroughItems(items), 1000);
                } else {
                    // No need to iterate through failed items or a single one available
                }
            } else {
                const index = availableList.current[currentAvailableListIndex];
                if (index == null) {
                    throw new Error('Current available item is not defined');
                }

                const currentItem: MediaCardContent | undefined = items[index];
                if (!currentItem) {
                    throw new Error('Current item is not found among available items');
                }

                // Change the current available item in a while (if possible)
                const showTime = getShowTime(currentItem.contentType);
                if (showTime !== null) {
                    timeout = setTimeout(() => {
                        if (!isMounted.current) {
                            return;
                        }

                        const nextIndex =
                            currentAvailableListIndex >= availableList.current.length - 1
                                ? 0
                                : currentAvailableListIndex + 1;
                        setCurrentAvailableListIndex(nextIndex);
                    }, showTime);
                } else {
                    // Stop the items iteration
                }
            }
        }

        if (!contentList || contentList.length < 2) {
            // No need to iterate through the items
        } else {
            iterateThroughItems(contentList);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [availableList, contentList, currentAvailableListIndex, failureIndexList]);

    return contentList ? contentList[currentItemIndex] : undefined;
}
