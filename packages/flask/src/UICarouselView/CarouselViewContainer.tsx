import React from "react"

import { View, StyleSheet } from "react-native"

import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

import { UICarouselViewPage } from "./CarouselViewPage";
import { Pagination } from "./CarouselViewPagination";
import type { UICarouselViewContainerProps, UICarouselViewPageProps } from "./types";

const getPages = (
    children: React.ReactNode,
): React.ReactElement<UICarouselViewPageProps>[] => {
    const childElements: React.ReactElement<UICarouselViewPageProps>[] 
        = React.Children.toArray(children).reduce<React.ReactElement<UICarouselViewPageProps>[]>(
        (
            acc: React.ReactElement[],
            child: React.ReactNode,
        ): React.ReactElement<UICarouselViewPageProps>[] => {
            if (React.isValidElement(child)) {
                const pages: React.ReactElement<UICarouselViewPageProps>[] = acc;
                if (child.type === UICarouselViewPage) {
                    pages.push(child);
                    return pages;
                }

                if (child.type === React.Fragment) {
                    pages.push(...getPages(child.props.children));
                    return pages;
                }
            }
            if (__DEV__) {
                throw new Error(
                    `UICarouselViewContainer can only contain 'UICarouselView.Page' components as its direct children (found ${
                        // eslint-disable-next-line no-nested-ternary
                        React.isValidElement(child)
                            ? `${
                                  typeof child.type === 'string'
                                      ? child.type
                                      : child.type?.name
                              }`
                            : typeof child === 'object'
                            ? JSON.stringify(child)
                            : `'${String(child)}'`
                    })`,
                );
            }
            return acc;
        },
        [],
    );

    return childElements;
};

const usePages = (
    children:
        | React.ReactElement<UICarouselViewPageProps>
        | React.ReactElement<UICarouselViewPageProps>[],
): React.ReactElement<UICarouselViewPageProps>[] => {
    return React.useMemo((): React.ReactElement<UICarouselViewPageProps>[] => {
        const pages: React.ReactElement<UICarouselViewPageProps>[] = getPages(
            children,
        );
        return pages;
    }, [children]);
};

const renderComponent = (props: UICarouselViewPageProps, index: number) => {
    const ChildView = props.component;
    const childTestID = props.testID ?? `UICarouselPage_${index}`;
    return (
        <View key={childTestID} testID={childTestID}>
            <ChildView />
        </View>
    )
}

const returnPages = (pages:  React.ReactElement<UICarouselViewPageProps>[]) => {
    return pages.map((item, index) => {
        return renderComponent(item.props, index)
    })
}

type ScrollState = {
    isScrolling: boolean
}

const useStateCallback = (initialState: any, callback: any) => {
    const [state, setState] = React.useState(initialState);

    React.useEffect(() => callback(state), [state, callback]);

    return [state, setState];
}

export const UICarouselViewContainer: React.FC<UICarouselViewContainerProps> = ({
    activeIndex = 0,
    onPageIndexChange,
    children,
    testID,
}: UICarouselViewContainerProps) => {

    const pagerRef = React.useRef<PagerView>(null);
    const scrollState = React.useRef<ScrollState>({isScrolling: false})
    const pages: React.ReactElement<UICarouselViewPageProps>[] = usePages(children);

    const setIsScrolling = () => { scrollState.current.isScrolling = false}

    const [currentIndex, setCurrentIndex] = useStateCallback(activeIndex, setIsScrolling);

    const isScrolling = React.useMemo(() => scrollState.current.isScrolling,[scrollState])

    const setPage = React.useCallback(async (index: number) => {
        scrollState.current.isScrolling = true
        setCurrentIndex(index)
        pagerRef.current?.setPage(index)
    },[setCurrentIndex])

    const onPageSelected = React.useCallback(({nativeEvent}: PagerViewOnPageSelectedEvent) => {
        setCurrentIndex(nativeEvent.position)
    },[setCurrentIndex])

    React.useEffect(() => {
        console.log(scrollState.current.isScrolling)
    }, [scrollState])

    React.useEffect(() => {
        !isScrolling && setPage(activeIndex)
    }, [activeIndex, setPage, isScrolling])

    React.useEffect(() => {
        if (onPageIndexChange) {
            onPageIndexChange(currentIndex);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    const moveShouldSetResponderCapture = () => {
        return isScrolling
    }

    if (pages.length === 0) {
        console.error(
            `UICarouselViewContainer: children must have at least 1 item`,
        );
        return null;
    }
    
    return(
        <View testID={testID} style={styles.carouselViewContainer}>
            <PagerView 
                ref={pagerRef}
                style={styles.carouselView} 
                initialPage={currentIndex}
                onPageSelected={onPageSelected}
                onMoveShouldSetResponderCapture={moveShouldSetResponderCapture}
            >
                {returnPages(pages)}
            </PagerView>
            <Pagination
                pages={pages}
                activeIndex={currentIndex}
                setPage={setPage}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    carouselViewContainer:{
        width: '100%', 
        height: '100%'
    },
    carouselView: {
      flex: 1,
      width: '100%',
      height: '100%',
    }
  });
