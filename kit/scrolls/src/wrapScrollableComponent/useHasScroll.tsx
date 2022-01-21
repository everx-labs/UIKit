import * as React from 'react';
import type { ScrollViewProps } from 'react-native';

import { ScrollableContext } from '../Context';

export function useHasScroll(
    onLayoutProp?: ScrollViewProps['onLayout'],
    onContentSizeChangeProp?: ScrollViewProps['onContentSizeChange'],
) {
    const { hasScroll, setHasScroll } = React.useContext(ScrollableContext);

    const scrollViewOutterHeight = React.useRef(0);
    const scrollViewInnerHeight = React.useRef(0);

    const compareHeights = React.useCallback(() => {
        if (!setHasScroll) {
            return;
        }

        if (scrollViewInnerHeight.current === 0 || scrollViewOutterHeight.current === 0) {
            return;
        }

        setHasScroll(scrollViewInnerHeight.current > scrollViewOutterHeight.current);
    }, [setHasScroll]);

    const onLayout: ScrollViewProps['onLayout'] = React.useCallback(
        event => {
            const {
                nativeEvent: {
                    layout: { height },
                },
            } = event;
            if (onLayoutProp) {
                onLayoutProp(event);
            }

            scrollViewOutterHeight.current = height;

            compareHeights();
        },
        [compareHeights, onLayoutProp],
    );

    const onContentSizeChange: ScrollViewProps['onContentSizeChange'] = React.useCallback(
        (width, height) => {
            if (onContentSizeChangeProp) {
                onContentSizeChangeProp(width, height);
            }

            scrollViewInnerHeight.current = height;

            compareHeights();
        },
        [compareHeights, onContentSizeChangeProp],
    );

    return {
        hasScroll,
        onLayout,
        onContentSizeChange,
    };
}
