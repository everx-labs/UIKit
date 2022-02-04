/* eslint-disable no-param-reassign */
import type * as React from 'react';
// @ts-ignore
import Animated, {
    measure as measureNative,
    scrollTo as scrollToNative,
} from 'react-native-reanimated';
import type { View, ScrollView as RNScrollView, NativeScrollEvent } from 'react-native';

import { AnimationHelpers } from '@tonlabs/uikit.layout';
import type { ScrollHandlerContext } from '../../types';

const { getYWithRubberBandEffect } = AnimationHelpers;

const measure: (
    ...args: Parameters<typeof measureNative>
) => Promise<ReturnType<typeof measureNative>> = (...args) => {
    'worklet';

    return new Promise((resolve, reject) => {
        const [aref] = args;
        if (aref && aref.current) {
            (aref.current as View).measure((x, y, width, height, pageX, pageY) => {
                resolve({ x, y, width, height, pageX, pageY });
            });
        } else {
            reject(new Error('measure: animated ref not ready'));
        }
    });
};

const scrollTo: (...args: Parameters<typeof scrollToNative>) => Promise<void> = (...args) => {
    'worklet';

    return new Promise((resolve, reject) => {
        const [aref, x, y] = args;
        if (aref && aref.current) {
            (aref.current as RNScrollView).scrollTo({ x, y });
            resolve(undefined);
        } else {
            reject(new Error('scrollTo: animated ref not ready'));
        }
    });
};

export default function onScroll(
    scrollRef: React.RefObject<RNScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    largeTitleHeight: Animated.SharedValue<number>,
    yIsNegative: Animated.SharedValue<boolean>,
    shift: Animated.SharedValue<number>,
    rubberBandDistance: number,
) {
    return async (event: NativeScrollEvent, ctx: ScrollHandlerContext) => {
        const { y } = event.contentOffset;

        if (largeTitleHeight.value === 0) {
            try {
                largeTitleHeight.value = (await measure(largeTitleViewRef)).height || 0;
            } catch (e) {
                // nothing
            }
        }

        yIsNegative.value = y <= 0;
        if (y <= 0) {
            // scrollTo reset real y, so we need to count it ourselves
            ctx.yWithoutRubberBand -= y;
            if (shift.value > 0) {
                shift.value = getYWithRubberBandEffect(ctx.yWithoutRubberBand, rubberBandDistance);
            } else {
                shift.value -= y;
            }
            try {
                await scrollTo(scrollRef, 0, 0, false);
            } catch (e) {
                // nothing
            }
        } else if (shift.value > 0 - largeTitleHeight.value) {
            // scrollTo reset real y, so we need to count it ourselves
            ctx.yWithoutRubberBand -= y;
            shift.value = Math.max(shift.value - y, 0 - largeTitleHeight.value);
            try {
                await scrollTo(scrollRef, 0, 0, false);
            } catch (e) {
                // nothing
            }
        }
    };
}
