import * as React from 'react';
import type { ScrollViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

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
        const { onLayout, onContentSizeChange } = useHasScroll();

        const {
            ref,
            scrollHandler,
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
            <Animated.View style={{ flex: 1 }}>
                {/* @ts-ignore */}
                <AnimatedScrollable
                    {...props}
                    ref={ref}
                    onScrollBeginDrag={scrollHandler}
                    scrollEventThrottle={16}
                    onLayout={onLayout}
                    onContentSizeChange={onContentSizeChange}
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
