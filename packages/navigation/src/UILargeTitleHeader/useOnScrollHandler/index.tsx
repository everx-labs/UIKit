import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { ScrollableOnScrollHandler } from '../../Scrollable/Context';

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
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    rubberBandDistance: number,
    parentScrollHandler: ScrollableOnScrollHandler,
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
            shiftChangedForcibly,
            rubberBandDistance,
            parentScrollHandler,
        ) as (event: NativeScrollEvent) => void;
    }

    return onScrollCbRef.current;
}
