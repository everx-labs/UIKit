import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { ScrollableParentScrollHandler } from '@tonlabs/uikit.scrolls';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import createOnScroll from './onScroll';
import { useRubberBandEffectDistance } from '../../useRubberBandEffectDistance';

export function useOnScrollHandler(
    scrollRef: React.RefObject<Animated.ScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    largeTitleHeight: Animated.SharedValue<number>,
    yIsNegative: Animated.SharedValue<boolean>,
    shift: Animated.SharedValue<number>,
    parentScrollHandler: ScrollableParentScrollHandler,
    parentScrollHandlerActive: boolean,
) {
    const onScrollCbRef = React.useRef<((event: NativeScrollEvent) => void) | null>(null);
    const rubberBandDistance = useRubberBandEffectDistance();

    if (onScrollCbRef.current == null) {
        onScrollCbRef.current = createOnScroll(
            scrollRef,
            largeTitleViewRef,
            largeTitleHeight,
            yIsNegative,
            shift,
            rubberBandDistance.value,
            parentScrollHandler,
            parentScrollHandlerActive,
        ) as (event: NativeScrollEvent) => void;
    }

    return onScrollCbRef.current;
}
