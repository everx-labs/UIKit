import * as React from 'react';
import {
    ScrollViewProps,
    Platform,
    ScrollView as RNScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
    NativeViewGestureHandler,
    PanGestureHandler,
} from 'react-native-gesture-handler';

import { ScrollableContext } from './Context';

type Props = ScrollViewProps & { children?: React.ReactNode };

export const ScrollView = React.forwardRef<RNScrollView>(
    function ScrollViewForwarded(props: Props, forwardRef) {
        const nativeGestureRef = React.useRef<NativeViewGestureHandler>(null);

        const scrollViewOutterHeight = React.useRef(0);
        const scrollViewInnerHeight = React.useRef(0);

        const compareHeights = React.useCallback((setHasScroll) => {
            if (!setHasScroll) {
                return;
            }

            if (
                scrollViewInnerHeight.current === 0 ||
                scrollViewOutterHeight.current === 0
            ) {
                return;
            }

            setHasScroll(
                scrollViewInnerHeight.current > scrollViewOutterHeight.current,
            );
        }, []);

        const {
            ref,
            scrollHandler,
            gestureHandler,
            onWheel,
            setHasScroll,
        } = React.useContext(ScrollableContext);

        React.useImperativeHandle(forwardRef, () => {
            // @ts-ignore
            return ref?.current;
        });

        return (
            <PanGestureHandler
                enabled={Platform.OS === 'android'}
                shouldCancelWhenOutside={false}
                onGestureEvent={gestureHandler}
                waitFor={nativeGestureRef}
            >
                <Animated.View style={{ flex: 1 }}>
                    <NativeViewGestureHandler ref={nativeGestureRef}>
                        <Animated.ScrollView
                            {...props}
                            ref={ref}
                            overScrollMode="never"
                            onScrollBeginDrag={scrollHandler}
                            scrollEventThrottle={16}
                            // @ts-ignore
                            onWheel={onWheel}
                            onLayout={({
                                nativeEvent: {
                                    layout: { height },
                                },
                            }) => {
                                scrollViewOutterHeight.current = height;

                                compareHeights(setHasScroll);
                            }}
                            onContentSizeChange={(_width, height) => {
                                scrollViewInnerHeight.current = height;

                                compareHeights(setHasScroll);
                            }}
                        />
                    </NativeViewGestureHandler>
                </Animated.View>
            </PanGestureHandler>
        );
    },
);

ScrollView.displayName = 'ScrollView';
