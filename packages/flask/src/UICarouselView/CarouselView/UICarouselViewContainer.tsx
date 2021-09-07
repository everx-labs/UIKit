import React from "react";
import type { UICarouselViewContainerProps, UICarouselViewPageProps } from "../types";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { CarouselViewContainer } from "./CarouselContainer";
import { usePages } from "./hooks";
import { Pagination } from "./Pagination";


export const UICarouselViewContainer: React.FC<UICarouselViewContainerProps>  = ({
        testID,
        children,
        initialIndex = 0,
        onPageIndexChange,
        isPageMovesOnPress,
        showPagination = true,
    }:UICarouselViewContainerProps) => {
    
    const pages: React.ReactElement<UICarouselViewPageProps>[] = usePages(children);

    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

    const onIndexChanged = React.useCallback((index: number) => {
        if(index !== currentIndex){
            setCurrentIndex(index)
        }
    }, [setCurrentIndex, currentIndex])

    React.useEffect(()=>{
        onPageIndexChange && onPageIndexChange(currentIndex)
    }, [onPageIndexChange, currentIndex])

    return (
        <>
            <CarouselViewContainer
                testID={testID}
                initialIndex={currentIndex}
                onPageIndexChange={onIndexChanged}
                pages={pages}
                isPageMovesOnPress={isPageMovesOnPress}
             />
            {showPagination && <Pagination
                pages={pages}
                activeIndex={currentIndex}
                setPage={setCurrentIndex}
            />}
        </>
    )
}