import * as React from 'react';
import type { ScrollViewProps, ScrollView as RNScrollView } from 'react-native';
import Animated from 'react-native-reanimated';

import { ScrollableContext } from '../Context';
import { useHasScroll } from './useHasScroll';

type Props = ScrollViewProps & { children?: React.ReactNode };

export const ScrollView = React.forwardRef<RNScrollView>(
    function ScrollViewForwarded(props: Props, forwardRef) {
        const { onLayout, onContentSizeChange } = useHasScroll();

        const {
            ref,
            scrollHandler,
            onWheel,
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
        }, [registerScrollable, unregisterScrollable]);

        React.useImperativeHandle(forwardRef, () => {
            // @ts-ignore
            return ref?.current;
        });

        return (
            <Animated.View style={{ flex: 1 }}>
                <Animated.ScrollView
                    {...props}
                    ref={ref}
                    overScrollMode="never"
                    onScrollBeginDrag={scrollHandler}
                    scrollEventThrottle={16}
                    // @ts-ignore
                    onWheel={onWheel}
                    onLayout={onLayout}
                    onContentSizeChange={onContentSizeChange}
                />
            </Animated.View>
        );
    },
);

ScrollView.displayName = 'ScrollView';
