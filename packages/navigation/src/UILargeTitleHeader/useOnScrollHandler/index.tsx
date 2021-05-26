import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import type Animated from 'react-native-reanimated';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import createOnScroll from './onScroll';

export function useOnScrollHandler(
    scrollRef: React.RefObject<Animated.ScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    largeTitleHeight: Animated.SharedValue<number>,
    yIsNegative: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    shift: Animated.SharedValue<number>,
    rubberBandDistance: number,
) {
    const onScrollCbRef = React.useRef<
        ((event: NativeScrollEvent) => void) | null
    >(null);

    if (onScrollCbRef.current == null) {
        onScrollCbRef.current = createOnScroll(
            scrollRef,
            largeTitleViewRef,
            largeTitleHeight,
            yIsNegative,
            yWithoutRubberBand,
            shift,
            rubberBandDistance,
        ) as (event: NativeScrollEvent) => void;
    }

    return onScrollCbRef.current;
}
