import React from 'react';
import type { UICarouselViewContainerProps, UICarouselViewPageProps } from '../types';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { CarouselViewContainer } from './CarouselContainer';
import { usePages } from './usePages';

export function UICarouselViewContainer({
    testID,
    children,
    initialIndex = 0,
    onPageIndexChange,
    shouldPageMoveOnPress,
    showPagination = true,
}: UICarouselViewContainerProps) {
    const pages: React.ReactElement<UICarouselViewPageProps>[] = usePages(children);

    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    React.useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    if (pages.length === 0) {
        console.error(`UICarouselViewContainer: children must have at least 1 item`);
        return null;
    }

    return (
        <CarouselViewContainer
            testID={testID}
            initialIndex={currentIndex}
            onPageIndexChange={onPageIndexChange}
            pages={pages}
            shouldPageMoveOnPress={shouldPageMoveOnPress}
            showPagination={showPagination}
        />
    );
}
