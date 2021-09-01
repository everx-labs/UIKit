import React from "react"

import { View, StyleSheet } from "react-native"

import PagerView from 'react-native-pager-view';

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
    console.log(childTestID)
    return (
        <View testID={childTestID}>
            <ChildView />
        </View>
    )
}

const returnPages = (pages:  React.ReactElement<UICarouselViewPageProps>[]) => {
    return pages.map((item, index) => {
        return renderComponent(item.props, index)
    })
}

export const UICarouselViewContainer: React.FC<UICarouselViewContainerProps> = ({
    initialPageIndex = 0,
    children,
    testID,
}: UICarouselViewContainerProps) => {

    const pagerRef = React.useRef<PagerView | null>(null);

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentIndex, setCurrentIndex] = React.useState(initialPageIndex);

    const pages: React.ReactElement<UICarouselViewPageProps>[] = usePages(
        children
    );
    
    const setPage = (index: number) => {
        pagerRef.current?.setPage(index)
    }

    if (pages.length === 0) {
        console.error(
            `UICarouselViewContainer: children must have at least 1 item`,
        );
        return null;
    }

    return(
        <View testID={testID} style={{width: '100%', height: '100%'}}>
            <PagerView 
                ref={ref => {pagerRef.current = ref}}
                style={styles.CarouselView} 
                initialPage={currentIndex} 
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

const iconSize = 192;
const circleSize = 6;

const styles = StyleSheet.create({
    CarouselView: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    icon: {
        width: iconSize,
        height: iconSize,
    },
    description: {
        letterSpacing: 0,
    },
    circle: {
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
    },
    pagination: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignSelf: 'center', 
    }
  });
