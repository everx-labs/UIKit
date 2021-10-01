import React from 'react';
import throttle from 'lodash/throttle';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';

import type { UICarouselViewContainerProps, UICarouselViewPageProps } from '../../types';
import { usePageStyle } from '../animations';
import { Pagination } from '../Pagination';

const returnPages = (
    pages: React.ReactElement<UICarouselViewPageProps>[],
    shouldPageMoveOnPress: boolean,
    nextPage: (index: number) => void,
) => {
    const onPress = React.useCallback(
        throttle((index: number) => nextPage(index), 1000, { leading: true, trailing: true }),
        [],
    );

    return pages.map((page, index) => {
        const onPressPage = Platform.select({ android: nextPage, default: onPress });
        const ChildView = page.props.component;
        const key = `UICarouselPage_${index}`;

        return (
            <Pressable
                disabled={!shouldPageMoveOnPress}
                key={key}
                testID={page.props.testID}
                onPress={onPressPage}
            >
                <ChildView />
            </Pressable>
        );
    });
};

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

type Props = UICarouselViewContainerProps & {
    pages: React.ReactElement<UICarouselViewPageProps>[];
};

export function CarouselViewContainer({
    initialIndex = 0,
    pages,
    testID,
    shouldPageMoveOnPress = true,
    onPageIndexChange,
    showPagination,
}: Props) {
    const pagerRef = React.useRef<PagerView>(null);
    const [offset, setOffset] = React.useState(0);
    const pagerStyle = usePageStyle(offset);
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    const setPage = React.useCallback((index: number) => {
        requestAnimationFrame(() => {
            pagerRef.current?.setPage(index);
        });
    }, []);

    const onPageScroll = React.useCallback(
        ({ nativeEvent }) => {
            setOffset(nativeEvent.offset);
        },
        [setOffset],
    );

    const onPageSelected = React.useCallback(
        ({ nativeEvent }: any) => {
            pagerRef.current?.setScrollEnabled(true);
            onPageIndexChange && onPageIndexChange(nativeEvent.position);
            setCurrentIndex(nativeEvent.position);
        },
        [onPageIndexChange],
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

    const renderPagination = React.useCallback(() => {
        return (
            showPagination && (
                <Pagination pages={pages} activeIndex={currentIndex} setPage={setPage} />
            )
        );
    }, [currentIndex, pages, setPage, showPagination]);

    React.useEffect(() => {
        setPage(initialIndex);
    }, [setPage, initialIndex]);

    return (
        <View testID={testID} style={styles.carouselViewContainer}>
            <AnimatedPagerView
                ref={pagerRef}
                style={[styles.carouselView, pagerStyle]}
                initialPage={initialIndex}
                onPageSelected={onPageSelected}
                onPageScroll={onPageScroll}
            >
                {returnPages(pages, shouldPageMoveOnPress, nextPage)}
            </AnimatedPagerView>
            {showPagination && (
                 <Pagination pages={pages} activeIndex={currentIndex} setPage={setPage} />
             )}
        </View>
    );
}

const styles = StyleSheet.create({
    carouselViewContainer: {
        width: '100%',
        height: '100%',
    },
    carouselView: {
        width: '100%',
        height: '100%',
    },
});
