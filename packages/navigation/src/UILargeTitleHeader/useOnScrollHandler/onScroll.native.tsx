/* eslint-disable no-param-reassign */
import type * as React from 'react';
import Animated, { measure, scrollTo } from 'react-native-reanimated';
import type {
    ScrollView as RNScrollView,
    NativeScrollEvent,
} from 'react-native';

import { getYWithRubberBandEffect } from '../getYWithRubberBandEffect';

export default function (
    scrollRef: React.RefObject<RNScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    largeTitleHeight: Animated.SharedValue<number>,
    yOverScroll: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    blockShift: Animated.SharedValue<number>,
    rubberBandDistance: number,
) {
    return (event: NativeScrollEvent) => {
        'worklet';

        const { y } = event.contentOffset;

        if (largeTitleHeight.value === 0) {
            try {
                largeTitleHeight.value = measure(largeTitleViewRef).height || 0;
            } catch (e) {
                // nothing
            }
        }
        yOverScroll.value = y <= 0;
        if (y <= 0) {
            // scrollTo reset real y, so we need to count it ourselves
            yWithoutRubberBand.value -= y;
            if (blockShift.value > 0) {
                blockShift.value = getYWithRubberBandEffect(
                    yWithoutRubberBand.value,
                    rubberBandDistance,
                );
            } else {
                blockShift.value -= y;
            }
            scrollTo(scrollRef, 0, 0, false);
        } else if (blockShift.value > 0 - largeTitleHeight.value) {
            // scrollTo reset real y, so we need to count it ourselves
            yWithoutRubberBand.value -= y;
            blockShift.value = Math.max(
                blockShift.value - y,
                0 - largeTitleHeight.value,
            );
            scrollTo(scrollRef, 0, 0, false);
        }
    };
}
