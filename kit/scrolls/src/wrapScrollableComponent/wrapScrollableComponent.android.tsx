import * as React from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { NativeViewGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';

import { ScrollableContext } from '../Context';
import { useHasScroll } from './useHasScroll';

export function wrapScrollableComponent<Props extends ScrollViewProps>(
    ScrollableComponent: React.ComponentClass<Props>,
    displayName: string,
) {
    const AnimatedScrollable = Animated.createAnimatedComponent(ScrollableComponent);

    function ScrollableForwarded(
        {
            containerStyle = { flex: 1 },
            ...props
        }: Props & { children?: React.ReactNode; containerStyle: StyleProp<ViewStyle> },
        forwardRef: React.RefObject<typeof AnimatedScrollable>,
    ) {
        const {
            horizontal,
            onLayout: onLayoutProp,
            onContentSizeChange: onContentSizeChangeProp,
        } = props;
        const { onLayout, onContentSizeChange } = useHasScroll(
            onLayoutProp,
            onContentSizeChangeProp,
        );
        const nativeGestureRef = React.useRef<NativeViewGestureHandler>(null);

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
                onGestureEvent={horizontal ? undefined : gestureHandler}
                simultaneousHandlers={nativeGestureRef}
            >
                <Animated.View style={containerStyle}>
                    <NativeViewGestureHandler
                        ref={nativeGestureRef}
                        disallowInterruption
                        shouldCancelWhenOutside={false}
                    >
                        {/* @ts-ignore */}
                        <AnimatedScrollable
                            {...props}
                            ref={ref}
                            overScrollMode="never"
                            onScrollBeginDrag={horizontal ? undefined : scrollHandler}
                            scrollEventThrottle={16}
                            onLayout={horizontal ? undefined : onLayout}
                            onContentSizeChange={horizontal ? undefined : onContentSizeChange}
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
