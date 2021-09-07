import * as React from "react"
import {
    Animated,
    PanResponder,
    StyleSheet,
    GestureResponderEvent,
    PanResponderGestureState,
    View,
    LayoutChangeEvent,
    Pressable
} from "react-native"

import type  { UICarouselViewContainerProps, UICarouselViewPageProps } from "../../types";
import { useAnimatedValue } from "../hooks";
import { AnimationConfig } from "./constants";
 
type Props = UICarouselViewContainerProps & {
    pages: React.ReactElement<UICarouselViewPageProps>[]
}

export const CarouselViewContainer: React.FC<Props> = ({
    pages,
    initialIndex = 0,
    testID,
    isPageMovesOnPress = true,
    onPageIndexChange,
}: Props) => {

    const [layout, setLayout] = React.useState({ width: 0, height: 0 });

    const panX = useAnimatedValue(0)
    const localPanX =  useAnimatedValue(0)

    const layoutRef = React.useRef(layout);
    const onPageChangedRef = React.useRef(onPageIndexChange);

    const currentIndexRef = React.useRef(0);
    const pendingIndexRef = React.useRef<number>();

    const swipeVelocityThreshold = 0.15;
    const swipeDistanceThreshold = layout.width / 2;

    const [isMoving, setIsMoving] = React.useState(false);

    const jumpToIndex = React.useCallback(
        (index: number) => {
            const offset = -index * layout.width;
            const { timing, ...transitionConfig } = AnimationConfig;
            Animated.parallel([
                timing(panX, {
                    ...transitionConfig,
                    toValue: offset,
                    useNativeDriver: false,
                }),
                Animated.sequence([
                    timing(localPanX, {
                        ...transitionConfig,
                        toValue: -layout.width/2,
                        useNativeDriver: false,
                        duration: transitionConfig.duration/2
                    }),
                    timing(localPanX, {
                        ...transitionConfig,
                        toValue: 0,
                        useNativeDriver: false,
                        duration: transitionConfig.duration/2
                    })
                ])
            ]).start(({ finished }) => {
                if (finished) {
                    pendingIndexRef.current = undefined;
                }
            });
            setIsMoving(false)
            onPageChangedRef.current && onPageChangedRef.current(index);
            pendingIndexRef.current = index;
        },[panX, localPanX, layout.width]);

    const jumpToNext = React.useCallback(() => {
        if(!isMoving){
            const nextIndex = (currentIndexRef.current + 1) % pages.length;
            jumpToIndex(nextIndex)
        }
    },[jumpToIndex, isMoving, pages])

    React.useEffect(() => {
        layoutRef.current = layout;
        const offset = -currentIndexRef.current * layoutRef.current.width;
        if(onPageIndexChange){
            onPageChangedRef.current = onPageIndexChange;
        }
        panX.setValue(offset);
    }, [layoutRef, panX, onPageIndexChange, layout]);

    React.useEffect(() => {
        if (layoutRef.current.width && currentIndexRef.current !== initialIndex) {
            currentIndexRef.current = initialIndex;
            jumpToIndex(initialIndex);
        }
    }, [jumpToIndex, layoutRef.current.width, initialIndex]);

    const startGesture = () => {
        setIsMoving(true)
        panX.stopAnimation();
        // @ts-expect-error: _value is private, but docs use it as well
        // eslint-disable-next-line no-underscore-dangle
        panX.setOffset(panX._value);
    };

    const respondToGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ) => {
        const diffX = gestureState.dx
        if (
            // swiping left
            (diffX > 0 && currentIndexRef.current <= 0) ||
            // swiping right
            (diffX < 0 && currentIndexRef.current >= pages.length - 1)
        ) {
            return;
        }
        localPanX.setValue(diffX);
        panX.setValue(diffX);
    };

    const finishGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ) => {
        panX.flattenOffset();
        localPanX.setValue(0)
        const currentIndex =
            typeof pendingIndexRef.current === 'number'
                ? pendingIndexRef.current
                : currentIndexRef.current;

        let nextIndex = currentIndex;
        if (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.vx) > Math.abs(gestureState.vy) &&
            (Math.abs(gestureState.dx) > swipeDistanceThreshold ||
                Math.abs(gestureState.vx) > swipeVelocityThreshold)
        ) {
            nextIndex = Math.round(
                Math.min(
                    Math.max(
                        0,
                        currentIndex - gestureState.dx / Math.abs(gestureState.dx)
                    ),
                    pages.length
                )
            );
            currentIndexRef.current = nextIndex;
        }

        if (!isFinite(nextIndex)) {
            nextIndex = currentIndex;
        }
        jumpToIndex(nextIndex);
    };

    const isMovingHorizontally = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2) &&
          Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 2)
        );
      };
    
      const canMoveScreen = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const diffX = gestureState.dx;
    
        return (
          isMovingHorizontally(event, gestureState) &&
          ((diffX >= 20 && currentIndexRef.current > 0) ||
            (diffX <= -20 && currentIndexRef.current < pages.length - 1))
        );
      };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: canMoveScreen,
        onMoveShouldSetPanResponderCapture:  canMoveScreen,
        onPanResponderGrant: startGesture,
        onPanResponderMove: respondToGesture,
        onPanResponderTerminate: finishGesture,
        onPanResponderRelease: finishGesture,
        onPanResponderTerminationRequest: () => true,
    });

    const maxWidthTranslate = layout.width * (pages.length - 1);
    const translateX = panX.interpolate({
        inputRange: [-maxWidthTranslate, 0],
        outputRange: [-maxWidthTranslate, 0],
    })
    
    const maxOpacityTranslate = layout.width/2
    const opacity = localPanX.interpolate({
        inputRange: [-maxOpacityTranslate, 0, maxOpacityTranslate], 
        outputRange: [.5, 1, .5],
    })

    const scale = localPanX.interpolate({
        inputRange: [-maxOpacityTranslate, 0, maxOpacityTranslate], 
        outputRange: [.9, 1, .9],
    })

    const handleLayout = React.useCallback((e: LayoutChangeEvent) => {
        const { height, width } = e.nativeEvent.layout;
        setLayout(prevLayout => {
            if (prevLayout.width === width && prevLayout.height === height) {
                return prevLayout;
            }
            return { height, width };
        });
    },[]);

    const renderPage = React.useCallback((page, index) => {
        const focused = index === currentIndexRef.current
        const PageComponent= page.props.component
        return(
            <Pressable
                disabled={!isPageMovesOnPress}
                onPress={jumpToNext}
                key={`UICarouselPage_${index}`}
                testID={page.props.testID}
            >
                <Animated.View
                    style={[{ transform: [{scale}], opacity},
                         // eslint-disable-next-line no-nested-ternary
                        layout.width ? { width: layout.width } : focused ? StyleSheet.absoluteFill : null,
                    ]}
                >
                    {layout.width ? <PageComponent /> : null}
                </Animated.View>
            </Pressable>
        )
    },[isPageMovesOnPress, jumpToNext, layout.width, scale, opacity])

    if (pages.length === 0) {
        console.error(
            `UICarouselViewContainer: children must have at least 1 item`,
        );
        return null;
    }

    return (
        <View testID={testID} onLayout={handleLayout} style={[styles.pager]}>
            <Animated.View
                style={[styles.sheet,
                        layout.width
                            ? {
                                width: pages.length * layout.width,
                                transform: [{ translateX }],
                            }
                            : null,
                        ]}
                {...panResponder.panHandlers}
                >
                {pages.map((page, index) => {
                    return renderPage( page, index )
                })}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    pager: {
        overflow: 'hidden',
        flex: 1,
    },
    sheet: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
    },
});
