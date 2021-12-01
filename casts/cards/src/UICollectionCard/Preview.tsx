import * as React from 'react';

import type { Content } from '../types';
import type { PreviewProps } from './types';
import { CollectionSlide } from './CollectionSlide';
import { usePreload } from './usePreload';
import { useCurrentSourceItemIndex } from './useCurrentSourceItemIndex';

export function Preview({ style, contentList }: PreviewProps) {
    usePreload(contentList);

    const currentSourceItemIndex = useCurrentSourceItemIndex(contentList);

    const currentContent: Content | null = React.useMemo(() => {
        return contentList[currentSourceItemIndex];
    }, [currentSourceItemIndex, contentList]);

    if (contentList.length === 0 || !currentContent) {
        return null;
    }

    return <CollectionSlide content={contentList[currentSourceItemIndex]} style={style} />;
}
