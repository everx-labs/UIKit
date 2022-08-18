import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';

import type { UICarouselViewContainerProps, UICarouselViewPageProps } from '../../types';
import { usePageStyle } from '../animations';
import { Pagination, PaginationRef } from '../Pagination';

function usePageViews(
    pages: React.ReactElement<UICarouselViewPageProps>[],
    shouldPageMoveOnPress: boolean,
    nextPage: (index: number) => void,
    pageStyle: ViewStyle,
) {
    const isInTransition = React.useRef(false);
    const transitionTimeoutID = React.useRef<NodeJS.Timeout>();
    const onPress = React.useCallback(
        (index: number) => {
            /**
             * On iOS there is an internal bug in
             * UIPageViewController, and common solution for it
             * in the Internet is too just avoid calling
             * transition until animation isn't finished.
             *
             * To detect when animation is finished we look
             * at the `onPageSelected` event and disable a guard
             * there (see onTransitionEnd);
             */
            if (isInTransition.current) {
                return;
            }
            isInTransition.current = true;

            /**
             * Sometimes `onPageSelected` isn't fired
             * after animation (didn't dig too much why so)
             * To avoid being stuck at the page,
             * run a big timeout that would mean that
             * probably it's already over and it's safe
             * to react on touches
             */
            if (transitionTimeoutID.current != null) {
                clearTimeout(transitionTimeoutID.current);
            }
            transitionTimeoutID.current = setTimeout(() => {
                isInTransition.current = false;
                transitionTimeoutID.current = undefined;
            }, 5000);

            nextPage(index);
        },
        [nextPage],
    );

    const onTransitionEnd = React.useCallback(() => {
        requestAnimationFrame(() => {
            isInTransition.current = false;
            if (transitionTimeoutID.current != null) {
                clearTimeout(transitionTimeoutID.current);
                transitionTimeoutID.current = undefined;
            }
        });
    }, []);

    return {
        pages: pages.map((page, index) => {
            const ChildView = page.props.component;
            const key = `UICarouselPage_${index}`;

            return (
                <Pressable
                    disabled={!shouldPageMoveOnPress}
                    key={key}
                    testID={page.props.testID}
                    onPress={() => onPress(index)}
                >
                    <Animated.View style={[styles.page, pageStyle]}>
                        <ChildView />
                    </Animated.View>
                </Pressable>
            );
        }),
        onTransitionEnd,
    };
}

interface Props extends Omit<UICarouselViewContainerProps, 'children'> {
    pages: React.ReactElement<UICarouselViewPageProps>[];
}

export function CarouselViewContainer({
    initialIndex = 0,
    pages,
    testID,
    shouldPageMoveOnPress = true,
    onPageIndexChange,
    showPagination,
}: Props) {
    const pagerRef = React.useRef<PagerView>(null);
    const { pageStyle, setOffset } = usePageStyle(0);

    const paginationRef = React.useRef<PaginationRef>(null);

    const setPage = React.useCallback((index: number) => {
        requestAnimationFrame(() => {
            pagerRef.current?.setPage(index);
            paginationRef.current?.setPage(index);
        });
    }, []);

    const onPageScroll = React.useCallback(
        ({ nativeEvent }: PagerViewOnPageScrollEvent) => {
            setOffset(nativeEvent.offset);
        },
        [setOffset],
    );

    const nextPage = React.useCallback(
        (index: number) => {
            pagerRef.current?.setScrollEnabled(false);
            requestAnimationFrame(() => {
                const desiredPage = (index + 1) % pages.length;
                setPage(desiredPage);
            });
        },
        [setPage, pages],
    );

    const { pages: pagesProcessed, onTransitionEnd } = usePageViews(
        pages,
        shouldPageMoveOnPress,
        nextPage,
        pageStyle,
    );

    const onPageSelected = React.useCallback(
        ({ nativeEvent }: any) => {
            pagerRef.current?.setScrollEnabled(true);
            onPageIndexChange && onPageIndexChange(nativeEvent.position);
            // setCurrentIndex(nativeEvent.position);
            onTransitionEnd();
        },
        [onPageIndexChange, onTransitionEnd],
    );

    React.useEffect(() => {
        setPage(initialIndex);
    }, [setPage, initialIndex]);

    return (
        <View testID={testID} style={styles.carouselViewContainer}>
            <PagerView
                ref={pagerRef}
                style={styles.carouselView}
                initialPage={initialIndex}
                onPageSelected={onPageSelected}
                onPageScroll={onPageScroll}
            >
                {pagesProcessed}
            </PagerView>
            {showPagination && (
                <Pagination
                    ref={paginationRef}
                    pages={pages}
                    initialPage={initialIndex}
                    onSetPage={setPage}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    carouselViewContainer: {
        flex: 1,
    },
    carouselView: {
        flex: 1,
    },
    page: {
        flex: 1,
    },
});
