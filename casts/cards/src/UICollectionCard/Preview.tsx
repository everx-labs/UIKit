import * as React from 'react';
import { UIImage } from '@tonlabs/uikit.media';
import type { ImageURISource } from 'react-native';

import type { MediaCardContent } from '../types';
import type { PreviewProps } from './types';

import { CollectionSlide } from './CollectionSlide';
import { useCurrentSourceItem } from './useCurrentSourceItem';

export function Preview({ style, contentList, onFailure }: PreviewProps) {
    React.useEffect(() => {
        const imageList: ImageURISource[] = [];
        contentList?.forEach((value: MediaCardContent) => {
            if (value.contentType === 'Image') {
                imageList.push(value.source);
            }
        });
        UIImage.prefetch(imageList);
    }, [contentList]);

    /**
     * The list of indexes of elements from array `contentList` that are ready for display
     *
     * Note: There is not need to put it in state as each list change will require the component
     * to rerender, which is actually almost useless since `useCurrentSourceItem` hook will change
     * the component state anyway in some short time.
     * Most important is to keep the list ref actual in order to let the hook process it properly
     * when iterating through the previews on each time slice.
     */
    const availableIndexList = React.useRef<number[]>([]);

    /**
     * The list of indexes of elements from array `contentList` for which onError was called
     * and cannot be displayed
     */
    const failureIndexList = React.useRef<number[]>([]);

    const currentSourceItem = useCurrentSourceItem(
        contentList,
        availableIndexList,
        failureIndexList,
    );

    const onLoadSourceItem = React.useCallback(
        (content: MediaCardContent) => {
            const sourceItemIndex = contentList?.indexOf(content);
            if (sourceItemIndex == null || sourceItemIndex < 0) {
                return;
            }

            if (
                !availableIndexList.current.includes(sourceItemIndex) &&
                !failureIndexList.current.includes(sourceItemIndex)
            ) {
                availableIndexList.current = availableIndexList.current.concat(sourceItemIndex);
            }
        },
        [contentList],
    );

    const onErrorSourceItem = React.useCallback(
        (error: Error, content: MediaCardContent) => {
            console.warn('[UICollectionCard] Failed to load preview with error:', error);

            const sourceItemIndex = contentList?.indexOf(content);
            if (sourceItemIndex == null || sourceItemIndex < 0) {
                return;
            }

            if (!failureIndexList.current.includes(sourceItemIndex)) {
                failureIndexList.current = failureIndexList.current.concat(sourceItemIndex);
            }

            if (availableIndexList.current.includes(sourceItemIndex)) {
                /**
                 * Remove this index from `availableIndexList`
                 * because an element with this index can't be displayed
                 */
                const newAvailableIndexList = availableIndexList.current.filter(
                    (availableIndex: number) => sourceItemIndex !== availableIndex,
                );
                availableIndexList.current = newAvailableIndexList;
            }

            if (failureIndexList.current.length === contentList?.length) {
                onFailure(new Error('All elements failed'));
            }
        },
        [contentList, onFailure],
    );

    if (!contentList || contentList.length === 0) {
        return null;
    }

    return (
        <>
            {contentList.map((content: MediaCardContent) => (
                <CollectionSlide
                    key={content.id}
                    content={content}
                    style={style}
                    isVisible={currentSourceItem === content}
                    onLoad={onLoadSourceItem}
                    onError={onErrorSourceItem}
                />
            ))}
        </>
    );
}
