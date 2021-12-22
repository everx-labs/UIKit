import * as React from 'react';
import { UIImage } from '@tonlabs/uikit.media';
import type { ImageURISource } from 'react-native';

import type { MediaCardContent } from '../types';
import type { PreviewProps } from './types';
import { CollectionSlide } from './CollectionSlide';
import { useCurrentSourceItemIndex } from './useCurrentSourceItemIndex';

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
     */
    const [availableIndexList, setAvailableIndexList] = React.useState<number[]>([]);
    /**
     * The list of indexes of elements from array `contentList` for which onError was called
     * and cannot be displayed
     */
    const [failureIndexList, setFailureIndexList] = React.useState<number[]>([]);

    const currentSourceItemIndex = useCurrentSourceItemIndex(contentList, availableIndexList);

    const onLoadSourceItem = React.useCallback(
        function onLoadSourceItem(sourceItemIndex: number) {
            return function onLoad() {
                if (
                    !availableIndexList.includes(sourceItemIndex) &&
                    !failureIndexList.includes(sourceItemIndex)
                ) {
                    setAvailableIndexList(availableIndexList.concat(sourceItemIndex));
                }
            };
        },
        [availableIndexList, failureIndexList],
    );

    const onErrorSourceItem = React.useCallback(
        function onErrorSourceItem(sourceItemIndex: number) {
            return function onError() {
                if (!failureIndexList.includes(sourceItemIndex)) {
                    setFailureIndexList(failureIndexList.concat(sourceItemIndex));
                }
                if (availableIndexList.includes(sourceItemIndex)) {
                    /**
                     * Remove this index from `availableIndexList`
                     * because an element with this index can't be displayed
                     */
                    const newAvailableIndexList = availableIndexList.filter(
                        (availableIndex: number) => sourceItemIndex !== availableIndex,
                    );
                    setAvailableIndexList(newAvailableIndexList);
                }
                if (failureIndexList.length === contentList?.length) {
                    /**
                     * All elements failed
                     */
                    onFailure();
                }
            };
        },
        [availableIndexList, failureIndexList, contentList, onFailure],
    );

    if (!contentList || contentList.length === 0) {
        return null;
    }

    return (
        <>
            {contentList.map((content: MediaCardContent, index: number) => (
                <CollectionSlide
                    key={content.id}
                    content={content}
                    style={style}
                    onLoad={onLoadSourceItem(index)}
                    onError={onErrorSourceItem(index)}
                    isVisible={index === currentSourceItemIndex}
                />
            ))}
        </>
    );
}
