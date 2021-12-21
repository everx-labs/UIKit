import * as React from 'react';
import type { ScrollViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

import { ScrollableContext } from '../Context';
import { useHasScroll } from './useHasScroll';

export function wrapScrollableComponent<Props extends ScrollViewProps>(
    ScrollableComponent: React.ComponentClass<Props>,
    displayName: string,
) {
    const AnimatedScrollable = Animated.createAnimatedComponent(ScrollableComponent);

    function ScrollableForwarded(
        props: Props & { children?: React.ReactNode },
        forwardRef: React.RefObject<typeof AnimatedScrollable>,
    ) {
        const {
            horizontal,
            // @ts-ignore
            onWheel: onWheelProp,
            onLayout: onLayoutProp,
            onContentSizeChange: onContentSizeChangeProp,
        } = props;
        const { onLayout, onContentSizeChange } = useHasScroll();

        const { ref, scrollHandler, onWheel, registerScrollable, unregisterScrollable } =
            React.useContext(ScrollableContext);

        React.useEffect(() => {
            if (registerScrollable) {
                registerScrollable();
            }

            return () => {
                if (unregisterScrollable) {
                    unregisterScrollable();
                }
            };
        }, [registerScrollable, unregisterScrollable]);

        // @ts-ignore
        React.useImperativeHandle(forwardRef, () => {
            return ref?.current;
        });

        return (
            <Animated.View style={{ flex: 1 }}>
                {/* @ts-ignore */}
                <AnimatedScrollable
                    {...props}
                    ref={ref}
                    overScrollMode="never"
                    onScrollBeginDrag={horizontal ? undefined : scrollHandler}
                    scrollEventThrottle={16}
                    // @ts-ignore
                    onWheel={horizontal ? onWheelProp : onWheel}
                    onLayout={horizontal ? onLayoutProp : onLayout}
                    onContentSizeChange={horizontal ? onContentSizeChangeProp : onContentSizeChange}
                />
            </Animated.View>
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
