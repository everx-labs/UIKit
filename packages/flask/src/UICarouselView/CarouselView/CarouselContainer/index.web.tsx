import * as React from "react"
import {
    Animated,
    PanResponder,
    StyleSheet,
    GestureResponderEvent,
    PanResponderGestureState,
    I18nManager,
    View,
    LayoutChangeEvent
} from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import type { UICarouselViewContainerProps, UICarouselViewPageProps } from "../../types";
import { usePages } from "../CarouselViewPage";

function useAnimatedValue(initialValue: number) {
    const lazyRef = React.useRef<Animated.Value>();

    if (lazyRef.current === undefined) {
        lazyRef.current = new Animated.Value(initialValue);
    }

    return lazyRef.current as Animated.Value;
}

const DefaultTransitionSpec = {
    timing: Animated.spring,
    stiffness: 5000,
    damping: 500,
    mass: 3,
    overshootClamping: false,
};

export const UICarouselViewContainer: React.FC<UICarouselViewContainerProps> = ({
    children,
    initialIndex = 0,
    // testID,
}: UICarouselViewContainerProps) => {

    const [layout, setLayout] = React.useState({ width: 0, height: 0 });

    const panX = useAnimatedValue(0)
    const pages: React.ReactElement<UICarouselViewPageProps>[] = usePages(children);
    const layoutRef = React.useRef(layout);

    const currentIndexRef = React.useRef(0);
    const pendingIndexRef = React.useRef<number>();

    const swipeVelocityThreshold = 0.15;
    const swipeDistanceThreshold = layout.width / 2.5;

    const jumpToIndex = React.useCallback(
        (index: number) => {
            const offset = -index * layout.width;
            console.log(offset)
            const { timing, ...transitionConfig } = DefaultTransitionSpec;

            Animated.parallel([
                timing(panX, {
                    ...transitionConfig,
                    toValue: offset,
                    useNativeDriver: false,
                }),
            ]).start(({ finished }) => {
                if (finished) {
                    // onIndexChangeRef.current(index);
                    pendingIndexRef.current = undefined;
                }
            });

            pendingIndexRef.current = index;
        },[panX, layout.width]);

    const jumpToNext = React.useCallback((index: number) => {
        const nextIndex = (index + 1) % pages.length;
        jumpToIndex(nextIndex)
    },[jumpToIndex, pages.length])

    React.useEffect(() => {
        layoutRef.current = layout;
    });

    React.useEffect(() => {
        const offset = -currentIndexRef.current * layoutRef.current.width;

        panX.setValue(offset);
    }, [layoutRef.current.width, panX]);

    React.useEffect(() => {
        if (layoutRef.current.width && currentIndexRef.current !== initialIndex) {
            currentIndexRef.current = initialIndex;
            jumpToIndex(initialIndex);
        }
    }, [jumpToIndex, layoutRef.current.width, initialIndex]);

    const startGesture = () => {
        // onSwipeStart?.();
        panX.stopAnimation();
        // @ts-expect-error: _value is private, but docs use it as well
        // eslint-disable-next-line no-underscore-dangle
        panX.setOffset(panX._value);
    };

    const respondToGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ) => {
        const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;

        if (
            // swiping left
            (diffX > 0 && currentIndexRef.current <= 0) ||
            // swiping right
            (diffX < 0 && currentIndexRef.current >= pages.length - 1)
        ) {
            return;
        }

        panX.setValue(diffX);
    };

    const finishGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ) => {
        panX.flattenOffset();

        // onSwipeEnd?.();

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
                        I18nManager.isRTL
                            ? currentIndex + gestureState.dx / Math.abs(gestureState.dx)
                            : currentIndex - gestureState.dx / Math.abs(gestureState.dx)
                    ),
                    pages.length - 1
                )
            );

            currentIndexRef.current = nextIndex;
        }

        if (!isFinite(nextIndex)) {
            nextIndex = currentIndex;
        }

        jumpToIndex(nextIndex);
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: startGesture,
        onPanResponderMove: respondToGesture,
        onPanResponderTerminate: finishGesture,
        onPanResponderRelease: finishGesture,
        onPanResponderTerminationRequest: () => true,
    });

    const maxTranslate = layout.width * (pages.length - 1);
    const translateX = Animated.multiply(
        panX.interpolate({
            inputRange: [-maxTranslate, 0],
            outputRange: [-maxTranslate, 0],
            extrapolate: 'clamp',
        }),
        I18nManager.isRTL ? -1 : 1
    );

    const handleLayout = (e: LayoutChangeEvent) => {
        const { height, width } = e.nativeEvent.layout;

        setLayout(prevLayout => {
            if (prevLayout.width === width && prevLayout.height === height) {
                return prevLayout;
            }

            return { height, width };
        });
    };

    if (pages.length === 0) {
        console.error(
            `UICarouselViewContainer: children must have at least 1 item`,
        );
        return null;
    }

    return (
        <View onLayout={handleLayout} style={[styles.pager]}>
            <Animated.View
                style={[styles.sheet,
                layout.width
                    ? {
                        width: pages.length * layout.width,
                        transform: [{ translateX }],
                    }
                    : null
                ]}
                {...panResponder.panHandlers}
            >
                {pages.map((page, index) => {
                    const focused = index === currentIndexRef.current;
                    const Page = page.props.component
                    const onPress = () => jumpToNext(index)
                    return (
                        <TouchableWithoutFeedback
                            onPress={onPress}
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            // eslint-disable-next-line no-nested-ternary
                            style={layout.width
                                ? { width: layout.width }
                                : focused
                                    ? StyleSheet.absoluteFill
                                    : null
                            }
                        >
                            {focused || layout.width ? <Page /> : null}
                        </TouchableWithoutFeedback>
                    );
                })}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    pager: {
        flex: 1,
        overflow: 'hidden',
    },
    sheet: {
        flex: 1,
        flexDirection: 'row',
    },
});
