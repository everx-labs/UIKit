import * as React from 'react';
import type { ScrollViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import {
    NativeViewGestureHandler,
    PanGestureHandler,
} from 'react-native-gesture-handler';

import { ScrollableContext } from '../Context';
import { useHasScroll } from './useHasScroll';

export function wrapScrollableComponent<Props extends ScrollViewProps>(
    ScrollableComponent: React.ComponentClass<Props>,
    displayName: string,
) {
    const AnimatedScrollable = Animated.createAnimatedComponent(
        ScrollableComponent,
    );

    function ScrollableForwarded(
        props: Props & { children?: React.ReactNode },
        forwardRef: React.RefObject<typeof AnimatedScrollable>,
    ) {
        const nativeGestureRef = React.useRef<NativeViewGestureHandler>(null);

        const { onLayout, onContentSizeChange } = useHasScroll();

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

        // @ts-ignore
        React.useImperativeHandle(forwardRef, () => {
            return ref?.current;
        });

        return (
            <PanGestureHandler
                ref={panGestureHandlerRef}
                shouldCancelWhenOutside={false}
                onGestureEvent={gestureHandler}
                simultaneousHandlers={nativeGestureRef}
            >
                <Animated.View style={{ flex: 1 }}>
                    <NativeViewGestureHandler
                        ref={nativeGestureRef}
                        disallowInterruption={true}
                        shouldCancelWhenOutside={false}
                    >
                        {/* @ts-ignore */}
                        <AnimatedScrollable
                            {...props}
                            ref={ref}
                            overScrollMode="never"
                            onScrollBeginDrag={scrollHandler}
                            scrollEventThrottle={16}
                            onLayout={onLayout}
                            onContentSizeChange={onContentSizeChange}
                        />
                    </NativeViewGestureHandler>
                </Animated.View>
            </PanGestureHandler>
        );
    }

    ScrollableForwarded.displayName = `${displayName}Inner`;

    const Scrollable = React.forwardRef<typeof ScrollableComponent>(
        // @ts-ignore
        ScrollableForwarded,
    );

    Scrollable.displayName = displayName;

    return Scrollable;
}
