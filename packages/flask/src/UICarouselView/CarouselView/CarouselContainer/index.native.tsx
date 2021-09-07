import React from "react"
import { throttle } from "lodash";
import { View, StyleSheet, Pressable } from "react-native"
import Animated from "react-native-reanimated";
import PagerView from "react-native-pager-view";

import type { UICarouselViewContainerProps, UICarouselViewPageProps } from "../../types";
import { usePageStyle } from "../hooks";

const returnPages = (pages:  React.ReactElement<UICarouselViewPageProps>[], isPageMovesOnPress: boolean,  nextPage: any) => {
    return pages.map((item, index) => {
        const ChildView = item.props.component;
        const key = `UICarouselPage_${index}`;
        return (
            <Pressable
                disabled={!isPageMovesOnPress}
                key={key} 
                testID={item.props.testID} 
                onPress={throttle(() => 
                            nextPage(index), 250, { leading: false, trailing: true}
                        )}
            >
                <ChildView />
            </Pressable>
        )
    })
}

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

type Props = UICarouselViewContainerProps & {
    pages: React.ReactElement<UICarouselViewPageProps>[]
}

export const CarouselViewContainer: React.FC<Props> = function  UICarouselViewContainerF({
    initialIndex = 0,
    pages,
    testID,
    isPageMovesOnPress = true,
    onPageIndexChange,
}: Props){

    const pagerRef = React.useRef<PagerView>(null);
    const [offset, setOffset] = React.useState(0)
    const pageStyles = usePageStyle(offset)
    
    const setPage = React.useCallback((index: number) => {
        requestAnimationFrame(() => {
            pagerRef.current?.setPage(index)
        })
    },[])

    const onPageScroll = React.useCallback(({nativeEvent}) => {
        setOffset(nativeEvent.offset)
    },[setOffset])

    const onPageSelected = React.useCallback(({nativeEvent}: any) => {
        pagerRef.current?.setScrollEnabled(true)
        onPageIndexChange && onPageIndexChange(nativeEvent.position)
    },[onPageIndexChange])
    
    const nextPage = React.useCallback((index: number) => {
        pagerRef.current?.setScrollEnabled(false)
        requestAnimationFrame(() => {
            const desiredPage = (index + 1) % pages.length
            setPage(desiredPage)
        })
    },[setPage, pages])

    React.useEffect(()=>{
        setPage(initialIndex)
    },[setPage, initialIndex])

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
                style={[styles.carouselView, pageStyles]}
                initialPage={initialIndex}
                onPageSelected={onPageSelected}
                onPageScroll={onPageScroll}
            >
                {returnPages(pages, isPageMovesOnPress, nextPage)}
            </AnimatedPagerView>
        </View>
    )
}

const styles = StyleSheet.create({
    carouselViewContainer:{
        width: '100%', 
        height: '100%'
    },
    carouselView: {
      width: '100%',
      height: '100%',
    }
  });

