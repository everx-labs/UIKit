/* eslint-disable no-param-reassign */
import type * as React from 'react';
import Animated, { measure, scrollTo } from 'react-native-reanimated';
import type {
    ScrollView as RNScrollView,
    NativeScrollEvent,
} from 'react-native';

import { getYWithRubberBandEffect } from '../../AnimationHelpers/getYWithRubberBandEffect';

export default function (
    scrollRef: React.RefObject<RNScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    largeTitleHeight: Animated.SharedValue<number>,
    yIsNegative: Animated.SharedValue<boolean>,
    yWithoutRubberBand: Animated.SharedValue<number>,
    shift: Animated.SharedValue<number>,
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
        yIsNegative.value = y <= 0;
        if (y <= 0) {
            // scrollTo reset real y, so we need to count it ourselves
            yWithoutRubberBand.value -= y;
            if (shift.value > 0) {
                shift.value = getYWithRubberBandEffect(
                    yWithoutRubberBand.value,
                    rubberBandDistance,
                );
            } else {
                shift.value -= y;
            }
            scrollTo(scrollRef, 0, 0, false);
        } else if (shift.value > 0 - largeTitleHeight.value) {
            // scrollTo reset real y, so we need to count it ourselves
            yWithoutRubberBand.value -= y;
            shift.value = Math.max(shift.value - y, 0 - largeTitleHeight.value);
            scrollTo(scrollRef, 0, 0, false);
        }
    };
}
