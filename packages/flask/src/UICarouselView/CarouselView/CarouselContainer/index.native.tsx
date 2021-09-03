import React from "react"
import { throttle } from "lodash";
import { View, StyleSheet } from "react-native"
import Animated from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

import { Pagination } from "../Pagination";
import type { UICarouselViewContainerProps, UICarouselViewPageProps } from "../../types";
import { usePageStyle } from "../utils/animations";
import { usePages } from "../CarouselViewPage";

const renderComponent = (props: UICarouselViewPageProps, index: number, nextPage: any) => {
    const ChildView = props.component;
    const childTestID = props.testID ?? `UICarouselPage_${index}`;
    return (
        <TouchableWithoutFeedback
            key={childTestID} 
            testID={childTestID} 
            onPress={throttle(() => 
                        nextPage(index), 250, { leading: false, trailing: true}
                    )}
        >
            <ChildView />
        </TouchableWithoutFeedback>
    )
}

const returnPages = (pages:  React.ReactElement<UICarouselViewPageProps>[], nextPage: any) => {
    return pages.map((item, index) => {
        return renderComponent(item.props, index, nextPage)
    })
}

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export const UICarouselViewContainer: React.FC<UICarouselViewContainerProps> = function  UICarouselViewContainerF({
    initialIndex = 0,
    children,
    testID,
}: UICarouselViewContainerProps){

    const pagerRef = React.useRef<PagerView>(null);
    const pages: React.ReactElement<UICarouselViewPageProps>[] = usePages(children);
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
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

    React.useEffect(()=>{
        if(pagerRef.current !== null){
            console.log('fired')
            setPage(initialIndex)
        }
    },[pagerRef, initialIndex, setPage])

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
      width: '100%',
      height: '100%',
    }
  });

