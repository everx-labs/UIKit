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
                <Animated.ScrollView
                    {...props}
                    ref={ref}
                    onScrollBeginDrag={scrollHandler}
                    scrollEventThrottle={16}
                    onLayout={onLayout}
                    onContentSizeChange={onContentSizeChange}
                />
            </Animated.View>
        );
    },
);

ScrollView.displayName = 'ScrollView';
