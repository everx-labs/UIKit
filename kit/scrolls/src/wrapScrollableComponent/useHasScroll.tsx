import * as React from 'react';

import { ScrollableContext } from '../Context';

export function useHasScroll() {
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

    const onLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height },
            },
        }) => {
            scrollViewOutterHeight.current = height;

            compareHeights();
        },
        [compareHeights],
    );

    const onContentSizeChange = React.useCallback(
        (_width, height) => {
            scrollViewInnerHeight.current = height;

            compareHeights();
        },
        [compareHeights],
    );

    return {
        hasScroll,
        onLayout,
        onContentSizeChange,
    };
}
