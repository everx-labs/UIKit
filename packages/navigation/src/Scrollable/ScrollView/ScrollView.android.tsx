import * as React from 'react';
import type { ScrollViewProps, ScrollView as RNScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import {
    NativeViewGestureHandler,
    PanGestureHandler,
} from 'react-native-gesture-handler';

import { ScrollableContext } from '../Context';
import { useHasScroll } from './useHasScroll';

type Props = ScrollViewProps & { children?: React.ReactNode };

export const ScrollView = React.forwardRef<RNScrollView>(
    function ScrollViewForwarded(props: Props, forwardRef) {
        const nativeGestureRef = React.useRef<NativeViewGestureHandler>(null);

        const { hasScroll, onLayout, onContentSizeChange } = useHasScroll();

        const {
            ref,
            panGestureHandlerRef,
            scrollHandler,
            gestureHandler,
            registerScrollable,
            unregisterScrollable,
        } = React.useContext(ScrollableContext);

        React.useEffect(() => {
            if (registerScrollable) {
                registerScrollable();
            }

            return () => {
                if (unregisterScrollable) {
                    unregisterScrollable();
                }
            };
        });

        React.useImperativeHandle(forwardRef, () => {
            // @ts-ignore
            return ref?.current;
        });

        return (
            <PanGestureHandler
                ref={panGestureHandlerRef}
                shouldCancelWhenOutside={false}
                onGestureEvent={gestureHandler}
                {...(hasScroll ? { waitFor: nativeGestureRef } : null)}
            >
                <Animated.View style={{ flex: 1 }}>
                    <NativeViewGestureHandler ref={nativeGestureRef}>
                        <Animated.View
                            style={{
                                height: '100%',
                            }}
                        >
                            <Animated.ScrollView
                                {...props}
                                ref={ref}
                                overScrollMode="never"
                                onScrollBeginDrag={scrollHandler}
                                scrollEventThrottle={16}
                                onLayout={onLayout}
                                onContentSizeChange={onContentSizeChange}
                            />
                        </Animated.View>
                    </NativeViewGestureHandler>
                </Animated.View>
            </PanGestureHandler>
        );
    },
);

ScrollView.displayName = 'ScrollView';
