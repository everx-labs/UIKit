import React from "react"
import { throttle } from "lodash";

import { View, StyleSheet, TouchableOpacity } from "react-native"

import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import Animated from "react-native-reanimated";

import { UICarouselViewPage } from "./CarouselViewPage";
import { Pagination } from "./Pagination";
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

const renderComponent = (props: UICarouselViewPageProps, index: number, nextPage: any) => {
    const ChildView = props.component;
    const childTestID = props.testID ?? `UICarouselPage_${index}`;
    return (
        <TouchableOpacity 
            activeOpacity={1} 
            key={childTestID} 
            testID={childTestID} 
            onPress={throttle(() => 
                        nextPage(index), 250, { leading: false, trailing: true}
                    )}
        >
            <ChildView />
        </TouchableOpacity>
    )
}

const returnPages = (pages:  React.ReactElement<UICarouselViewPageProps>[], nextPage: any) => {
    return pages.map((item, index) => {
        return renderComponent(item.props, index, nextPage)
    })
}

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export const UICarouselViewContainer: React.FC<UICarouselViewContainerProps> = ({
    activeIndex = 0,
    children,
    testID,
}: UICarouselViewContainerProps) => {

    const pagerRef = React.useRef<PagerView>(null);
    const pages: React.ReactElement<UICarouselViewPageProps>[] = usePages(children);

    const [currentIndex, setCurrentIndex] = React.useState(activeIndex);

    const setPage = React.useCallback(async (index: number) => {
        requestAnimationFrame(() => {
            pagerRef.current?.setPage(index)
        })
    },[])

    const onPageScroll = React.useCallback(({nativeEvent}) => {
        console.log(nativeEvent)
    },[])

    const onPageSelected = React.useCallback(({nativeEvent}: PagerViewOnPageSelectedEvent) => {
        setCurrentIndex(nativeEvent.position)
        pagerRef.current?.setScrollEnabled(true)
    },[setCurrentIndex])
    
    const nextPage = React.useCallback((index: number) => {
        pagerRef.current?.setScrollEnabled(false)
        requestAnimationFrame(() => {
            const desiredPage = (index + 1) % pages.length
            setPage(desiredPage)
        })
    },[setPage, pages])

    

    if (pages.length === 0) {
        console.error(
            `UICarouselViewContainer: children must have at least 1 item`,
        );
        return null;
    }
    
    return(
        <View testID={testID} style={styles.carouselViewContainer}>
            <AnimatedPagerView 
                ref={pagerRef}
                style={styles.carouselView} 
                initialPage={0}
                onPageSelected={onPageSelected}
                onPageScroll={onPageScroll}
            >
                {returnPages(pages, nextPage)}
            </AnimatedPagerView>
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
