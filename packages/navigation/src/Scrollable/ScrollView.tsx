import * as React from 'react';
import { ScrollViewProps, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import {
    NativeViewGestureHandler,
    PanGestureHandler,
} from 'react-native-gesture-handler';

import { ScrollableContext } from './Context';

export function ScrollView(
    props: ScrollViewProps & { children?: React.ReactNode },
) {
    const panGestureRef = React.useRef<PanGestureHandler>(null);
    const nativeGestureRef = React.useRef<NativeViewGestureHandler>(null);
    return (
        <ScrollableContext.Consumer>
            {({ ref, scrollHandler, gestureHandler, onWheel }) => (
                <PanGestureHandler
                    ref={panGestureRef}
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
                            />
                        </NativeViewGestureHandler>
                    </Animated.View>
                </PanGestureHandler>
            )}
        </ScrollableContext.Consumer>
    );
}
