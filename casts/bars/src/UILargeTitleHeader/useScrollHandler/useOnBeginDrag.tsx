/* eslint-disable no-param-reassign */
import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import Animated, { cancelAnimation } from 'react-native-reanimated';
import type { ScrollableParentScrollHandler } from '@tonlabs/uikit.scrolls';
import { initVelocityTracker, setDragging } from './scrollContext';
import type { ScrollHandlerContext } from './scrollContext';

export function useOnBeginDrag(
    currentPosition: Animated.SharedValue<number>,
    mightApplyShiftToScrollView: Animated.SharedValue<boolean>,
    parentScrollHandler: ScrollableParentScrollHandler,
) {
    const onBeginHandlerRef = React.useRef<
        ((event: NativeScrollEvent, ctx: ScrollHandlerContext) => void) | null
    >(null);

    if (onBeginHandlerRef.current == null) {
        onBeginHandlerRef.current = (_event: NativeScrollEvent, ctx: ScrollHandlerContext) => {
            'worklet';

            console.log('onBeginDrag');

            cancelAnimation(currentPosition);

            setDragging(ctx);
            initVelocityTracker(ctx);
            mightApplyShiftToScrollView.value = false;

            // TODO: check it
            parentScrollHandler(_event);
        };
    }

    return onBeginHandlerRef.current || undefined;
}
